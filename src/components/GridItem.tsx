import React, { memo } from 'react';
import { GridItem as IGridItem } from '../types';
import { ICON_MAP } from '../constants';

interface GridItemProps {
  item: IGridItem;
  isSelected: boolean;
  onClick: (id: string) => void;
  disabled: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
}

const GridItemComponent: React.FC<GridItemProps> = ({ item, isSelected, onClick, disabled, isCorrect, isWrong }) => {
  const IconComponent = ICON_MAP[item.iconName];

  // Base card style
  let baseClasses = "relative w-full aspect-square rounded-xl flex items-center justify-center transition-all duration-300 transform border-2 shadow-sm cursor-pointer";
  
  // Default State (Light/Dark)
  let stateClasses = "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-pastel-blue dark:hover:border-pastel-blue hover:shadow-md";

  if (isSelected) {
    stateClasses = "bg-slate-50 dark:bg-slate-700 border-pastel-blue shadow-[0_0_0_4px_rgba(125,211,252,0.3)] scale-95 z-10";
  }

  if (isCorrect) {
    stateClasses = "bg-green-50 dark:bg-green-900/30 border-pastel-green shadow-[0_0_20px_rgba(134,239,172,0.5)] animate-pulse-fast z-10";
  }

  if (isWrong) {
    stateClasses = "bg-red-50 dark:bg-red-900/30 border-pastel-red shadow-[0_0_20px_rgba(253,164,175,0.5)] animate-shake z-10";
  }

  return (
    <button
      onClick={() => !disabled && onClick(item.id)}
      disabled={disabled}
      className={`${baseClasses} ${stateClasses}`}
    >
      {IconComponent && (
        <IconComponent
          className={`w-[60%] h-[60%] transition-colors duration-300 drop-shadow-sm`}
          style={{ 
            color: isCorrect ? '#22c55e' : isWrong ? '#ef4444' : item.color,
            filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.05))' 
          }}
          strokeWidth={2.5}
        />
      )}
    </button>
  );
};

export const GridItem = memo(GridItemComponent);