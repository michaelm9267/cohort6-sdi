import PropTypes from 'prop-types';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/material/styles';
import { SideNav } from './side-nav';
import { TopNav } from './top-nav';
import { useState, useEffect } from 'react';

const SIDE_NAV_WIDTH = 280;

const VerticalLayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  [theme.breakpoints.up('lg')]: {
    // paddingLeft: SIDE_NAV_WIDTH,
  },
}));


const VerticalLayoutContainer = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  width: '100%',
});

export const VerticalLayout = (props) => {
  const { children, sections, navColor, onSearch, handleMode, mode, checked } = props;
  const isScreenSmall = useMediaQuery(theme => theme.breakpoints.down('xs'));
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  const toggleSideNav = () => {
    setIsSideNavOpen(!isSideNavOpen);
  };

  return (
    <>
      <TopNav
        onSearch={onSearch}
        onToggleSideNav={toggleSideNav}
        handleMode={handleMode}
        mode={mode}
        checked={checked}
      />
      {isScreenSmall ? (
        isSideNavOpen && (
          <SideNav
            color={navColor}
            sections={sections}
          />
        )
      ) : (
        <SideNav
          color={navColor}
          sections={sections}
          isOpen={isSideNavOpen}
          onToggleSideNav={toggleSideNav}
        />
      )}
      <VerticalLayoutRoot>
        <VerticalLayoutContainer
          sx={{ maxWidth: "2000px", margin: "0 auto" }}
        >{children}</VerticalLayoutContainer>
      </VerticalLayoutRoot>
    </>
  );
};

VerticalLayout.propTypes = {
  children: PropTypes.node,
  navColor: PropTypes.oneOf(['blend-in', 'discrete', 'evident']),
  sections: PropTypes.array,
};
