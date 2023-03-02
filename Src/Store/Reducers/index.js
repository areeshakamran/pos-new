import { combineReducers } from 'redux';
import UserReducer from "./UserReducer";
import HomeReducer from './HomeReducer'
import ColorReducer from './ColorReducer';
import SharedReducer from './SharedReducer';
import SaleReducer from './SalesReducer';
import CartReducer from './CartReducer';
import TableReducer from './TableReducer';
import DraftReducer from './DraftReducer';

const RootReducer = combineReducers({
    User: UserReducer,
    Color: ColorReducer,
    Shared: SharedReducer,
    Home: HomeReducer,
    Sale: SaleReducer,
    Cart: CartReducer,
    Table: TableReducer,
    Draft: DraftReducer
});

export default (state, action) => RootReducer(state, action);