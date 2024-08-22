import PropTypes from 'prop-types';

import { useSettings } from '../../hooks/use-settings';

import { useSections } from './config';
import { VerticalLayout } from './vertical-layout';
import { navigate } from '@redwoodjs/router'

export const Layout = (props) => {
  const settings = useSettings();
  const sections = useSections();
  const navigateToSearchResults = (value) => {
    console.log(value)
    navigate(`/search-results?query=${value}`)
  }


  return (
    <VerticalLayout
      sections={sections}
      navColor={settings.navColor}
      onSearch={navigateToSearchResults}
      {...props}
    />
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};
