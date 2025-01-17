import React from 'react';

import useMergeState from 'hooks/useMergeState';
import { APIVoteEntity, fetchAbrogationVoters } from 'modules/senatus/api';

import { useAbrogation } from '../AbrogationProvider';

type AbrogationVotersProviderState = {
  votes: APIVoteEntity[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  supportFilter?: boolean;
};

export type AbrogationVotersContextType = AbrogationVotersProviderState & {
  changeSupportFilter(supportFilter?: boolean): void;
  changePage(page: number): void;
};

const InitialState: AbrogationVotersProviderState = {
  votes: [],
  total: 0,
  page: 1,
  pageSize: 10,
  loading: false,
  supportFilter: undefined,
};

const AbrogationVotersContext = React.createContext<AbrogationVotersContextType>({
  ...InitialState,
  changeSupportFilter: () => undefined,
  changePage: () => undefined,
});

export function useAbrogationVoters(): AbrogationVotersContextType {
  return React.useContext(AbrogationVotersContext);
}

const AbrogationVotersProvider: React.FC = props => {
  const { children } = props;

  const { abrogation } = useAbrogation();
  const [state, setState] = useMergeState<AbrogationVotersProviderState>(InitialState);

  React.useEffect(() => {
    if (!abrogation) {
      setState({
        votes: [],
        total: 0,
      });
      return;
    }

    setState({ loading: true });

    fetchAbrogationVoters(abrogation.proposalId, state.page, state.pageSize, state.supportFilter)
      .then(data => {
        setState({
          loading: false,
          votes: data.data,
          total: data.meta.count,
        });
      })
      .catch(() => {
        setState({
          loading: false,
          votes: [],
        });
      });
  }, [abrogation, state.page, state.supportFilter]);

  function changeSupportFilter(supportFilter?: boolean) {
    setState({
      supportFilter,
      page: 1,
    });
  }

  function changePage(page: number) {
    setState({ page });
  }

  return (
    <AbrogationVotersContext.Provider
      value={{
        ...state,
        changeSupportFilter,
        changePage,
      }}>
      {children}
    </AbrogationVotersContext.Provider>
  );
};

export default AbrogationVotersProvider;
