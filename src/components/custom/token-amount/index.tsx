import React from 'react';
import BigNumber from 'bignumber.js';
import { isMobile } from 'react-device-detect';
import cn from 'classnames';
import { MAX_UINT_256, formatBigValue } from 'web3/utils';

import Slider from 'components/antd/slider';
import Grid from 'components/custom/grid';
import Icon, { TokenIconNames } from 'components/custom/icon';
import NumericInput from 'components/custom/numeric-input';
import { Text } from 'components/custom/typography';

import s from './s.module.scss';

export type TokenAmountProps = {
  className?: string;
  tokenIcon?: TokenIconNames | React.ReactNode;
  max?: number | BigNumber;
  maximumFractionDigits?: number;
  value?: number | BigNumber;
  name?: string;
  disabled?: boolean;
  slider?: boolean;
  displayDecimals?: number;
  onChange?: (value?: BigNumber) => void;
};

const TokenAmount: React.FC<TokenAmountProps> = props => {
  const {
    className,
    tokenIcon,
    max,
    maximumFractionDigits = 4,
    value,
    name,
    disabled = false,
    slider = false,
    displayDecimals = 4,
    onChange,
  } = props;

  const step = 1 / 10 ** Math.min(displayDecimals, 6);
  const bnMaxValue = new BigNumber(max ?? MAX_UINT_256);

  const bnValue = value !== undefined ? BigNumber.min(new BigNumber(value), bnMaxValue) : undefined;

  function onMaxHandle() {
    onChange?.(bnMaxValue);
  }

  function handleInputChange(inputValue?: BigNumber) {
    onChange?.(inputValue ? BigNumber.min(inputValue, bnMaxValue) : undefined);
  }

  function onSliderChange(sliderValue: number) {
    onChange?.(new BigNumber(sliderValue));
  }

  return (
    <Grid flow="row" gap={32}>
      <NumericInput
        className={cn(s.component, className)}
        placeholder={max !== undefined ? `0 (Max ${formatBigValue(bnMaxValue, displayDecimals)})` : ''}
        addonBefore={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {typeof tokenIcon === 'string' && <Icon name={tokenIcon as TokenIconNames} width={32} height={32} />}
            {typeof tokenIcon === 'object' && tokenIcon}
            <div className="mr-8" />
            {!isMobile && (
              <Text type="lb1" weight="semibold" color="primary">
                {name}
              </Text>
            )}
          </div>
        }
        addonAfter={
          max !== undefined ? (
            <button type="button" className={cn('button-ghost', s.maxBtn)} disabled={disabled} onClick={onMaxHandle}>
              <span>MAX</span>
            </button>
          ) : null
        }
        maximumFractionDigits={maximumFractionDigits}
        disabled={disabled}
        value={bnValue}
        onChange={handleInputChange}
      />
      {slider && (
        <Slider
          min={0}
          max={bnMaxValue.toNumber()}
          step={step}
          tooltipPlacement="bottom"
          tipFormatter={sliderValue => (sliderValue ? formatBigValue(new BigNumber(sliderValue), displayDecimals) : 0)}
          disabled={disabled}
          value={bnValue?.toNumber()}
          onChange={onSliderChange}
        />
      )}
    </Grid>
  );
};

export default TokenAmount;
