import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Chip from '@mui/material/Chip';
import SvgIcon from '@mui/material/SvgIcon';
// import { Link, routes } from '@redwoodjs/router'
// import { Routes } from '../../../../web/src/Routes'

import AlignLeft02Icon from '../../icons/untitled-ui/duocolor/align-left-02';
import BarChartSquare02Icon from '../../icons/untitled-ui/duocolor/bar-chart-square-02';
import Building04Icon from '../../icons/untitled-ui/duocolor/building-04';
import CalendarIcon from '../../icons/untitled-ui/duocolor/calendar';
import CheckDone01Icon from '../../icons/untitled-ui/duocolor/check-done-01';
import CreditCard01Icon from '../../icons/untitled-ui/duocolor/credit-card-01';
import CurrencyBitcoinCircleIcon from '../../icons/untitled-ui/duocolor/currency-bitcoin-circle';
import File01Icon from '../../icons/untitled-ui/duocolor/file-01';
import GraduationHat01Icon from '../../icons/untitled-ui/duocolor/graduation-hat-01';
import HomeSmileIcon from '../../icons/untitled-ui/duocolor/home-smile';
import LayoutAlt02Icon from '../../icons/untitled-ui/duocolor/layout-alt-02';
import LineChartUp04Icon from '../../icons/untitled-ui/duocolor/line-chart-up-04';
import Lock01Icon from '../../icons/untitled-ui/duocolor/lock-01';
import LogOut01Icon from '../../icons/untitled-ui/duocolor/log-out-01';
import Mail03Icon from '../../icons/untitled-ui/duocolor/mail-03';
import Mail04Icon from '../../icons/untitled-ui/duocolor/mail-04';
import MessageChatSquareIcon from '../../icons/untitled-ui/duocolor/message-chat-square';
import ReceiptCheckIcon from '../../icons/untitled-ui/duocolor/receipt-check';
import Share07Icon from '../../icons/untitled-ui/duocolor/share-07';
import ShoppingBag03Icon from '../../icons/untitled-ui/duocolor/shopping-bag-03';
import ShoppingCart01Icon from '../../icons/untitled-ui/duocolor/shopping-cart-01';
import Truck01Icon from '../../icons/untitled-ui/duocolor/truck-01';
import Upload04Icon from '../../icons/untitled-ui/duocolor/upload-04';
import Users03Icon from '../../icons/untitled-ui/duocolor/users-03';
import XSquareIcon from '../../icons/untitled-ui/duocolor/x-square';
import { tokens } from '../../locales/tokens';
// import { routes } from '@redwoodjs/router'
import { paths } from '../../paths'
import { Building01, ShoppingBag01, ShoppingCart01 } from '@untitled-ui/icons-react';
import { useAuth } from '../../../../web/src/auth';

export const useSections = () => {
  const { t } = useTranslation();
  const { currentUser, hasRole } = useAuth()

  return useMemo(() => {
    const isBasic = hasRole('basic')
    const isAdmin = hasRole('admin')

    let items = [];

    if (isBasic) {
      items = [
        {
          title: t(tokens.nav.unit),
          path: paths.unit,
          icon: (
            <SvgIcon fontSize="small">
              <HomeSmileIcon />
            </SvgIcon>
          ),
        },
        {
          title: t(tokens.nav.shopInventory),
          path: paths.shopInventory,
          icon: (
            <SvgIcon fontSize="small">
              <Building04Icon />
            </SvgIcon>
          ),
        },
        {
          title: t(tokens.nav.shopCart),
          path: paths.shopCart,
          icon: (
            <SvgIcon fontSize="small">
              <ShoppingCart01 />
            </SvgIcon>
          ),
        },
        {
          title: t(tokens.nav.shopOrders),
          path: paths.shopOrders,
          icon: (
            <SvgIcon fontSize="small">
              <ShoppingBag01 />
            </SvgIcon>
          ),
        },
      ];
    } else if (isAdmin) {
      items = [
        {
          title: t(tokens.nav.approvals),
          path: paths.approvals,
          icon: (
            <SvgIcon fontSize="small">
              <CheckDone01Icon />
            </SvgIcon>
          )
        },
        {
          title: t(tokens.nav.listOfUnits),
          path: paths.listOfUnits,
          icon: (
            <SvgIcon fontSize='small'>
              <Building01 />
            </SvgIcon>
          )
        },
        {
          title: t(tokens.nav.shopOrders),
          path: paths.shopOrders,
          icon: (
            <SvgIcon fontSize="small">
              <ShoppingBag01 />
            </SvgIcon>
          ),
        },
      ];
    } else {
      items = [
        {
          title: t(tokens.nav.listOfUnits),
          path: paths.listOfUnits,
          icon: (
            <SvgIcon fontSize='small'>
              <Building01 />
            </SvgIcon>
          )
        },
        {
          title: t(tokens.nav.shopOrders),
          path: paths.shopOrders,
          icon: (
            <SvgIcon fontSize="small">
              <ShoppingBag01 />
            </SvgIcon>
          ),
        },
      ];
    }

    return [{ items }];
  }, [currentUser, t, hasRole]);
};
