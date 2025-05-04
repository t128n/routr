import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

type Option = {
	value: string;
	label: string;
};

interface VirtualizedCommandProps {
	height: string;
	options: Option[];
	placeholder: string;
	emptyPlaceholder?: string;
	selectedValue: string;
	onSelectValue?: (value: string) => void;
}

const VirtualizedCommand = ({
	height,
	options,
	placeholder,
	emptyPlaceholder,
	selectedValue,
	onSelectValue,
}: VirtualizedCommandProps) => {
	const [filteredOptions, setFilteredOptions] =
		React.useState<Option[]>(options);
	const [focusedIndex, setFocusedIndex] = React.useState(0);
	const [isKeyboardNavActive, setIsKeyboardNavActive] = React.useState(false);

	const parentRef = React.useRef<HTMLDivElement>(null);

	const virtualizer = useVirtualizer({
		count: filteredOptions.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 35,
	});

	const virtualOptions = virtualizer.getVirtualItems();

	const scrollToIndex = (index: number) => {
		virtualizer.scrollToIndex(index, { align: "center" });
	};

	const handleSearch = (search: string) => {
		setIsKeyboardNavActive(false);
		setFilteredOptions(
			options.filter((option) =>
				option.label.toLowerCase().includes(search.toLowerCase()),
			),
		);
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		switch (event.key) {
			case "ArrowDown": {
				event.preventDefault();
				setIsKeyboardNavActive(true);
				setFocusedIndex((prev) => {
					const newIndex =
						prev === -1 ? 0 : Math.min(prev + 1, filteredOptions.length - 1);
					scrollToIndex(newIndex);
					return newIndex;
				});
				break;
			}
			case "ArrowUp": {
				event.preventDefault();
				setIsKeyboardNavActive(true);
				setFocusedIndex((prev) => {
					const newIndex =
						prev === -1 ? filteredOptions.length - 1 : Math.max(prev - 1, 0);
					scrollToIndex(newIndex);
					return newIndex;
				});
				break;
			}
			case "Enter": {
				event.preventDefault();
				if (filteredOptions[focusedIndex]) {
					onSelectValue?.(filteredOptions[focusedIndex].value);
				}
				break;
			}
			default:
				break;
		}
	};

	React.useEffect(() => {
		if (selectedValue) {
			const option = filteredOptions.find((opt) => opt.value === selectedValue);
			if (option) {
				const index = filteredOptions.indexOf(option);
				setFocusedIndex(index);
				virtualizer.scrollToIndex(index, { align: "center" });
			}
		}
	}, [selectedValue, filteredOptions, virtualizer]);

	return (
		<Command shouldFilter={false} onKeyDown={handleKeyDown}>
			<CommandInput onValueChange={handleSearch} placeholder={placeholder} />
			<CommandList
				ref={parentRef}
				style={{ height: height, width: "100%", overflow: "auto" }}
				onMouseDown={() => setIsKeyboardNavActive(false)}
				onMouseMove={() => setIsKeyboardNavActive(false)}
			>
				<CommandEmpty>{emptyPlaceholder ?? "No item found."}</CommandEmpty>
				<CommandGroup>
					<div
						style={{
							height: `${virtualizer.getTotalSize()}px`,
							width: "100%",
							position: "relative",
						}}
					>
						{virtualOptions.map((virtualOption) => (
							<CommandItem
								key={filteredOptions[virtualOption.index].value}
								disabled={isKeyboardNavActive}
								className={cn(
									"absolute left-0 top-0 w-full bg-transparent",
									focusedIndex === virtualOption.index &&
										"bg-accent text-accent-foreground",
									isKeyboardNavActive &&
										focusedIndex !== virtualOption.index &&
										"aria-selected:bg-transparent aria-selected:text-primary",
								)}
								style={{
									height: `${virtualOption.size}px`,
									transform: `translateY(${virtualOption.start}px)`,
								}}
								value={filteredOptions[virtualOption.index].value}
								onMouseEnter={() =>
									!isKeyboardNavActive && setFocusedIndex(virtualOption.index)
								}
								onMouseLeave={() => !isKeyboardNavActive && setFocusedIndex(-1)}
								onSelect={onSelectValue}
							>
								<Check
									className={cn(
										"mr-2 h-4 w-4",
										selectedValue === filteredOptions[virtualOption.index].value
											? "opacity-100"
											: "opacity-0",
									)}
								/>
								{filteredOptions[virtualOption.index].label}
							</CommandItem>
						))}
					</div>
				</CommandGroup>
			</CommandList>
		</Command>
	);
};

interface VirtualizedComboboxProps {
	options: Option[];
	searchPlaceholder?: string;
	emptyPlaceholder?: string;
	width?: string;
	height?: string;
	value?: string;
	onValueChange?: (value: string) => void;
}

export function VirtualizedCombobox({
	options,
	searchPlaceholder = "Search items...",
	emptyPlaceholder = "No items found.",
	width = "400px",
	height = "400px",
	value,
	onValueChange,
}: VirtualizedComboboxProps) {
	const [open, setOpen] = React.useState(false);
	// internal fallback state when uncontrolled
	const [internalValue, setInternalValue] = React.useState<string>("");

	// derive the “selected” value, preferring the controlled prop
	const selectedValue = value ?? internalValue;

	// when the user picks something, notify parent or update internal
	const handleValueChange = React.useCallback(
		(newValue: string) => {
			const toggled = selectedValue === newValue ? "" : newValue;
			if (onValueChange) {
				onValueChange(toggled);
			} else {
				setInternalValue(toggled);
			}
			setOpen(false);
		},
		[onValueChange, selectedValue],
	);

	const selectedOption = options.find((opt) => opt.value === selectedValue);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					// biome-ignore lint/a11y/useSemanticElements: See https://ui.shadcn.com/docs/components/combobox
					role="combobox"
					aria-expanded={open}
					className="justify-between"
					style={{ width: width }}
				>
					{selectedOption ? selectedOption.label : searchPlaceholder}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="p-0" style={{ width: width }}>
				<VirtualizedCommand
					height={height}
					options={options}
					placeholder={searchPlaceholder}
					emptyPlaceholder={emptyPlaceholder}
					selectedValue={selectedValue}
					onSelectValue={handleValueChange}
				/>
			</PopoverContent>
		</Popover>
	);
}
