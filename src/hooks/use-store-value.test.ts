// src/hooks/use-store-value.test.ts
import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useStoreValue } from './use-store-value';
import { store as actualStore } from '@/sw/store'; // Import the actual module

// Perform the mock, Vitest will replace the actual 'store' with this structure.
// We can then refer to `actualStore` in tests, and it will point to this mocked object.
vi.mock('@/sw/store', () => ({
  store: {
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
    DEFAULTS: {} as Record<string, any>, // Type assertion for DEFAULTS
  },
}));

// After vi.mock, any import of 'store' from '@/sw/store' in this test file
// or in the hook itself will receive the mocked version.
// For clarity and control in tests, we can use the 'actualStore' import,
// which Vitest has now ensured points to our mock.
const mockStore = actualStore;

describe('useStoreValue hook', () => {
  const TEST_KEY = 'testKey' as const;
  const DEFAULT_VALUE = 'defaultValue';
  const OVERRIDE_DEFAULT_VALUE = 'overrideDefaultValue';
  const STORED_VALUE = 'storedValue';
  const UPDATED_VALUE = 'updatedValue';

  let consoleErrorSpy: ReturnType<typeof vi.spyOn> | null = null;

  beforeEach(() => {
    // Reset all individual mock functions on the mockStore
    mockStore.get.mockReset();
    mockStore.set.mockReset().mockResolvedValue(undefined); // Default to resolved promise
    mockStore.delete.mockReset().mockResolvedValue(undefined); // Default to resolved promise
    
    // Reset DEFAULTS for each test.
    // The DEFAULTS object on the mockStore is directly modified.
    (mockStore.DEFAULTS as Record<string, any>) = {}; // Clear previous keys
    mockStore.DEFAULTS[TEST_KEY] = DEFAULT_VALUE;


    if (consoleErrorSpy) {
      consoleErrorSpy.mockRestore();
    }
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    if (consoleErrorSpy) {
      consoleErrorSpy.mockRestore();
      consoleErrorSpy = null;
    }
  });

  describe('Initial Value Resolution', () => {
    it('should return overrideDefault initially if provided, while store.get is fetching', () => {
      mockStore.get.mockReturnValue(new Promise(() => {})); // Simulate pending promise
      const { result } = renderHook(() => useStoreValue(TEST_KEY, OVERRIDE_DEFAULT_VALUE));
      expect(result.current.value).toBe(OVERRIDE_DEFAULT_VALUE);
    });

    it('should return store.DEFAULTS[key] initially if overrideDefault is NOT provided, while store.get is fetching', () => {
      mockStore.get.mockReturnValue(new Promise(() => {})); // Simulate pending promise
      const { result } = renderHook(() => useStoreValue(TEST_KEY));
      expect(result.current.value).toBe(DEFAULT_VALUE);
    });

    it('should eventually update to the value resolved from store.get if different', async () => {
      mockStore.get.mockResolvedValue(STORED_VALUE);
      const { result } = renderHook(() => useStoreValue(TEST_KEY, OVERRIDE_DEFAULT_VALUE));

      expect(result.current.value).toBe(OVERRIDE_DEFAULT_VALUE); 

      await act(async () => { 
        // Allow pending promises to resolve and useEffect to run.
        await new Promise(resolve => setTimeout(resolve, 0)); 
      });

      expect(result.current.value).toBe(STORED_VALUE);
    });

    it('should not update if store.get resolves to the same value as current', async () => {
      mockStore.get.mockResolvedValue(OVERRIDE_DEFAULT_VALUE); 
      const { result } = renderHook(() => useStoreValue(TEST_KEY, OVERRIDE_DEFAULT_VALUE));

      expect(result.current.value).toBe(OVERRIDE_DEFAULT_VALUE);
      await act(async () => { await new Promise(resolve => setTimeout(resolve, 0)); });
      expect(result.current.value).toBe(OVERRIDE_DEFAULT_VALUE); 
    });
    
    it('should continue to use the default value if store.get resolves to undefined', async () => {
      mockStore.get.mockResolvedValue(undefined);
      const { result } = renderHook(() => useStoreValue(TEST_KEY));

      expect(result.current.value).toBe(DEFAULT_VALUE);
      await act(async () => { await new Promise(resolve => setTimeout(resolve, 0)); });
      expect(result.current.value).toBe(DEFAULT_VALUE);
    });
  });

  describe('Value Update (update function)', () => {
    it('should immediately change the value returned by the hook (optimistic update)', () => {
      mockStore.get.mockResolvedValue(STORED_VALUE); 
      const { result } = renderHook(() => useStoreValue(TEST_KEY));
      
      act(() => {
        result.current.update(UPDATED_VALUE);
      });
      
      expect(result.current.value).toBe(UPDATED_VALUE);
    });

    it('should call store.set(key, newValue)', () => {
      mockStore.get.mockResolvedValue(STORED_VALUE);
      mockStore.set.mockResolvedValue(undefined); 
      const { result } = renderHook(() => useStoreValue(TEST_KEY));

      act(() => {
        result.current.update(UPDATED_VALUE);
      });

      expect(mockStore.set).toHaveBeenCalledWith(TEST_KEY, UPDATED_VALUE);
    });

    it('should call console.error if store.set rejects', async () => {
      mockStore.get.mockResolvedValue(STORED_VALUE);
      const setError = new Error('Failed to set');
      mockStore.set.mockRejectedValue(setError);
      
      const { result } = renderHook(() => useStoreValue(TEST_KEY));

      act(() => {
        result.current.update(UPDATED_VALUE);
      });

      await act(async () => { await new Promise(resolve => setTimeout(resolve, 0)); });
      
      expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to persist store value for key", TEST_KEY, setError);
    });
  });

  describe('Value Reset (reset function)', () => {
    it('should change the value to store.DEFAULTS[key]', async () => {
      mockStore.get.mockResolvedValue(STORED_VALUE); 
      const { result } = renderHook(() => useStoreValue(TEST_KEY));

      await act(async () => { await new Promise(resolve => setTimeout(resolve, 0)); });

      act(() => {
        result.current.reset();
      });

      expect(result.current.value).toBe(DEFAULT_VALUE);
    });

    it('should call store.delete(key)', async () => {
      mockStore.get.mockResolvedValue(STORED_VALUE);
      mockStore.delete.mockResolvedValue(undefined); 
      const { result } = renderHook(() => useStoreValue(TEST_KEY));
      
      await act(async () => { await new Promise(resolve => setTimeout(resolve, 0)); });

      act(() => {
        result.current.reset();
      });

      expect(mockStore.delete).toHaveBeenCalledWith(TEST_KEY);
    });

    it('should call console.error if store.delete rejects', async () => {
      mockStore.get.mockResolvedValue(STORED_VALUE);
      const deleteError = new Error('Failed to delete');
      mockStore.delete.mockRejectedValue(deleteError);
      const { result } = renderHook(() => useStoreValue(TEST_KEY));

      await act(async () => { await new Promise(resolve => setTimeout(resolve, 0)); });

      act(() => {
        result.current.reset();
      });
      
      await act(async () => { await new Promise(resolve => setTimeout(resolve, 0)); });

      expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to delete store value for key", TEST_KEY, deleteError);
    });
  });
});
