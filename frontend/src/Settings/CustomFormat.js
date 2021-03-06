import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import './CustomFormat.css';

const CustomFormat = ({
  isSelected, formatString, updateFormatString,
}) => {
  const parseFormatString = str => {
    const replaceChars = {
      $emoji$: '☀️',
      $temp$: '75 °F',
      $feelsLike$: '80 °F',
      $summary$: 'Clear',
      $dewPoint$: '52 °F',
      $cloudCover$: '5%',
      $humidity$: '62%',
      $pressure$: '1015.81 mb',
      $windSpeed$: '2.11 mph',
      $uvIndex$: '3',
      $visibility$: '5.78 miles',
      $ozone$: '381.84 DU',
      $name$: 'Splashin',
      $artists$: 'Rich the Kid',
      $album$: 'The World Is Yours 2',
      $duration$: '2:57',
    };
    return str.replace(/\$\w+\$/g, match => replaceChars[match] || match);
  };

  return (
    <Fragment>
      <div className='preview-box'>
        <h4 className='sub-heading'>Preview (using example data):</h4>
        <p className='preview'>{`${parseFormatString(formatString)}`}</p>
      </div>
      <textarea
        id='format'
        className='weather-format'
        // disabled={!isSelected}
        name='format'
        rows='5'
        cols='33'
        onChange={updateFormatString}
        value={formatString}
      />
    </Fragment>
  );
};

CustomFormat.defaultProps = {
  isSelected: true,
  formatString: '',
  updateFormatString: null,
};

CustomFormat.propTypes = {
  isSelected: PropTypes.bool,
  formatString: PropTypes.string,
  updateFormatString: PropTypes.func,
};

export default CustomFormat;
