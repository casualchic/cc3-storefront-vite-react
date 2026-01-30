import type { ProductOption } from '../../../types';
import './OptionSelector.css';

interface OptionSelectorProps {
  option: ProductOption;
  selectedValue: string | undefined;
  availableValues: Set<string>;
  onSelect: (optionName: string, value: string) => void;
}

export function OptionSelector({
  option,
  selectedValue,
  availableValues,
  onSelect,
}: OptionSelectorProps) {
  return (
    <div className="option-selector" role="group" aria-label={`${option.title} selection`}>
      <div className="option-label">{option.title}:</div>
      <div className="option-buttons">
        {option.values.map((optionValue) => {
          const isSelected = selectedValue === optionValue.value;
          const isAvailable = availableValues.has(optionValue.value);

          return (
            <button
              key={optionValue.id}
              type="button"
              aria-pressed={isSelected}
              aria-label={`${option.title} ${optionValue.value}`}
              disabled={!isAvailable}
              className={`
                option-button
                ${isSelected ? 'option-button-selected' : ''}
                ${!isAvailable ? 'option-button-unavailable' : ''}
              `.trim()}
              onClick={() => onSelect(option.title, optionValue.value)}
            >
              {optionValue.value}
            </button>
          );
        })}
      </div>
    </div>
  );
}
