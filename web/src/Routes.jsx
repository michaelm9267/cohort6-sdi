// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Router, Route, Set, PrivateSet } from '@redwoodjs/router'

import { useAuth } from './auth'
import { Layout } from './layouts/VerticalLayout/VerticalLayout'

const Routes = () => {
  return (
    <Router pageLoadingDelay={2000} useAuth={useAuth}>


      <Route path="/login" page={LoginPage} name="login" prerender />
      <Route path="/signup" page={SignupPage} name="signup" prerender />
      <Route path="/reset-password" page={ResetPasswordPage} name="resetPassword" />
      <Route path="/forgot-password" page={ForgotPasswordPage} name="forgotPassword" />
      <PrivateSet unauthenticated="login" roles={['basic', 'admin', 'transport']} prerender>
        <Set wrap={Layout} prerender>
          <Route path="/list-of-notifications" page={ListOfNotificationsPage} name="listOfNotifications" />
          <Route path="/" page={HomePage} name="home" />
          <Route path="/search-results" page={SearchResultsPage} name="searchResults" />
          <Route path="/shop-orders" page={ShopOrdersPage} name="shopOrders" />
          <Route path="/shop-cart" page={ShopCartPage} name="shopCart" />
          <Route path="/shop-inventory" page={ShopInventoryPage} name="shopInventory" />
          <Route notfound page={NotFoundPage} />
          <Route path="/test" page={TestPage} name="test" />
          <Route path="/presentation" page={PresentationPage} name="presentation" />
        </Set>
      </PrivateSet>
      <PrivateSet unauthenticated="home" roles={['admin', 'transport']}>
        <Set wrap={Layout}>
          <Route path="/listOfUnits" page={ListOfUnitsPage} name="listOfUnits" />
          <Route path="/order-form" page={OrderFormPage} name="orderForm" />
          <Route path="/approvals" page={ApprovalsPage} name="approvals" />
        </Set>
      </PrivateSet>
    </Router>
  )
}

export default Routes
