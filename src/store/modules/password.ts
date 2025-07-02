import { Module } from 'vuex';

export interface PaperItem {
  paperId: string;
  title: string;
  password: string;
  speaker: string;
  mail: string;
  presentationTime: string;
  sessionPlace: string;
  status: 'oral' | 'poster';
}

export interface PasswordState {
  papers: PaperItem[];
  demoCounter?: number;
  demoToggle?: boolean;
  loginCount?: Record<string, number>;
  logoutCount?: Record<string, number>;
  attendance?: Record<string, boolean>;
  downloads?: Record<string, boolean>;
}

const defaultState: PasswordState = {
  papers: [],
  demoCounter: 0,
  demoToggle: false,
  loginCount: {},
  logoutCount: {},
  attendance: {},
  downloads: {}
};

const passwordStore: Module<PasswordState, {}> = {
  state: defaultState,
  mutations: {
    setPapers(state, papers) {
      state.papers = papers;
    },
    incrementDemoCounter(state) {
      state.demoCounter = (state.demoCounter || 0) + 1;
    },
    setDemoToggle(state, value: boolean) {
      state.demoToggle = value;
    },
    incrementLoginCount(state, paperId: string) {
      if (!state.loginCount) state.loginCount = {};
      state.loginCount[paperId] = (state.loginCount[paperId] || 0) + 1;
    },
    incrementLogoutCount(state, paperId: string) {
      if (!state.logoutCount) state.logoutCount = {};
      state.logoutCount[paperId] = (state.logoutCount[paperId] || 0) + 1;
    },
    toggleAttendance(state, paperId: string) {
      if (!state.attendance) state.attendance = {};
      state.attendance[paperId] = !state.attendance[paperId];
    },
    markDownloaded(state, paperId: string) {
      if (!state.downloads) state.downloads = {};
      state.downloads[paperId] = true;
    },
    clearDownload(state, paperId: string) {
      if (state.downloads) {
        state.downloads[paperId] = false;
      }
    }
  },
  actions: {
    async fetchPapers({ commit }) {
      const response = await fetch('/data/papers.json');
      const papers = await response.json();
      commit('setPapers', papers);
    },
    incrementDemoCounter({ commit }) {
      commit('incrementDemoCounter');
    },
    setDemoToggle({ commit }, value: boolean) {
      commit('setDemoToggle', value);
    },
    incrementLoginCount({ commit }, paperId: string) {
      commit('incrementLoginCount', paperId);
    },
    incrementLogoutCount({ commit }, paperId: string) {
      commit('incrementLogoutCount', paperId);
    },
    toggleAttendance({ commit }, paperId: string) {
      commit('toggleAttendance', paperId);
    },
    markDownloaded({ commit }, paperId: string) {
      commit('markDownloaded', paperId);
    },
    clearDownload({ commit }, paperId: string) {
      commit('clearDownload', paperId);
    }
  }
};

export default passwordStore; 