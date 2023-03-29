import React from 'react';
import PropTypes from 'prop-types';
import IcomoonReact from 'icomoon-react';
import iconSet from 'assets/fonts/icomoon/lineicons/selection.json';

const Icon = (props) => {
  const { color, size, icon, className } = props;
  return <IcomoonReact className={className} iconSet={iconSet} color={color} size={size} icon={icon} />;
};

Icon.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.string.isRequired,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Icon.defaultProps = {
  color: '#fff',
  size: '20',
};

export const icons = () => iconSet.icons.map(icon => icon.properties.name)
export default Icon;