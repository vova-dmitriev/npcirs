import React, { useState, useEffect } from 'react';
import {
  Container,
  Input,
  InputOnChangeData,
  Icon,
  Message,
  Search,
  Label,
  Header,
} from 'semantic-ui-react';
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List,
} from 'react-virtualized';

import useDebounce from '../../hooks/useDebounce';
import { IRegion } from '../../interfaces/Region';

import './RegionsList.css';
import { useMediaQuery } from 'react-responsive';
import { isDesktopQuery } from '../../utils/responsive';

interface RegionsListProps {
  onChange: (region: IRegion) => void;
  data: IRegion[];
  activeItem: IRegion;
}

const RegionsList: React.FC<RegionsListProps> = ({
  onChange,
  activeItem,
  data = [],
}) => {
  const [items, setItems] = useState<IRegion[]>(data);
  const [filteredItems, setFilteredItems] = useState<IRegion[]>(data);
  const [query, setQuery] = useState<string>('');
  const debouncedQuery = useDebounce<typeof query>(query, 500);

  const isDesktop = useMediaQuery({ query: isDesktopQuery });

  const initialSearchState = {
    loading: false,
    results: [],
    value: '',
  };
  const [searchState, setSearchState] = useState<
    typeof initialSearchState
  >(initialSearchState);

  useEffect(() => {
    setItems(data);
    setFilteredItems(data);
  }, [data]);

  const handleSearch = (
    _: React.ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData,
  ) => {
    const text = data.value.toLowerCase();
    setQuery(text);
  };

  const findRegionByQuery = (
    data: IRegion[],
    query: string,
  ): IRegion[] => {
    return data.filter(
      (item) =>
        item.p01 &&
        item.p01.toLowerCase().includes(query.toLowerCase()),
    );
  };

  useEffect(() => {
    const newItems = findRegionByQuery(items, debouncedQuery);
    setFilteredItems(newItems);
  }, [debouncedQuery]);

  const clearSearch = () => {
    setQuery('');
    setFilteredItems(items);
  };

  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 30,
  });

  const renderRow = ({ index, key, style, parent }) => {
    const item = filteredItems[index];

    const cls = `row ${
      activeItem && activeItem.p00 === item.p00 ? 'active' : ''
    }`;

    return (
      <CellMeasurer
        key={key}
        cache={cache}
        parent={parent}
        columnIndex={0}
        rowIndex={index}
      >
        <div
          style={style}
          className={cls}
          onClick={() => onChange(item)}
        >
          <div className="list-content">
            <div>{filteredItems[index].p01}</div>
          </div>
        </div>
      </CellMeasurer>
    );
  };

  const clearIcon = query.length && (
    <Icon name="x" className="clear-icon" onClick={clearSearch} />
  );

  const handleResultsSearch = (_, data) => {
    setSearchState({
      results: searchState.results,
      loading: true,
      value: data.value,
    });

    if (data.value.length < 1) {
      return setSearchState(initialSearchState);
    }

    setTimeout(() => {
      const filteredResults = findRegionByQuery(
        items,
        searchState.value,
      );

      setSearchState({
        loading: false,
        results: filteredResults,
        value: data.value,
      });
    }, 300);
  };

  const resultRenderer = (item) => (
    <Label key={item.p00} content={item.p01} />
  );

  const handleResultSelect = (_, data) => {
    setSearchState({ ...searchState, value: data.result.p01 });
    const item = items.find((item) => item.p00 === data.result.p00);
    onChange(item);
  };

  if (!isDesktop) {
    return (
      <Container textAlign="center">
        <Search
          size="huge"
          fluid
          minCharacters={3}
          loading={searchState.loading}
          results={searchState.results}
          value={searchState.value}
          placeholder="Поиск субъекта"
          onSearchChange={handleResultsSearch}
          onResultSelect={handleResultSelect}
          resultRenderer={resultRenderer}
        />
        {activeItem && (
          <Header
            as="h3"
            content={`Выбранный субъект: ${activeItem.p01}`}
          />
        )}
      </Container>
    );
  }

  return (
    <div className="list-wrapper">
      <Container textAlign="center">
        <Message attached size="small">
          <Message.Header>Субъект РФ</Message.Header>
          <Message.Content>
            <Input
              icon={clearIcon || 'search'}
              placeholder="Поиск"
              onChange={handleSearch}
              className="region-input"
              value={query}
            />
          </Message.Content>
        </Message>
        <div className="list">
          <AutoSizer>
            {({ width, height }) => {
              return (
                <List
                  width={width}
                  height={height}
                  deferredMeasurementCache={cache}
                  rowHeight={cache.rowHeight}
                  rowRenderer={renderRow}
                  rowCount={filteredItems.length}
                  overscanRowCount={3}
                />
              );
            }}
          </AutoSizer>
        </div>
      </Container>
    </div>
  );
};

export default RegionsList;
