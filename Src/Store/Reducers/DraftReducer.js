import {
    ALL_ONLINE_DRAFTS,
    ALL_ONLINE_DRAFTS_ITEMS,
    ALL_OFFLINE_DRAFTS_ITEMS,
    CHANGE_PAGENUMBER_DRAFT,
    CHANGE_NEXTPAGE_DRAFT
} from '../Actions/type'

const initialState = {
    allDrafts: [],
    allOnlineDraftItems: [],
    alOfflineDraftItems: [],
    pageNumber: 1,
    NextPage: true,
}

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case ALL_ONLINE_DRAFTS:
            return {
                ...state,
                allDrafts: payload,
            }
        case ALL_ONLINE_DRAFTS_ITEMS:
            return {
                ...state,
                allOnlineDraftItems: payload,
            }
        case ALL_OFFLINE_DRAFTS_ITEMS:
            return {
                ...state,
                alOfflineDraftItems: payload,
            }
        case CHANGE_NEXTPAGE_DRAFT:
            return {
                ...state,
                NextPage: payload,
            };
        case CHANGE_PAGENUMBER_DRAFT:
            return {
                ...state,
                pageNumber: payload,
            };
        default:
            return state;
    }
};