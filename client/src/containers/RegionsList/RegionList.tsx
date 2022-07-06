import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Input,
  InputOnChangeData,
  Icon,
  Message,
} from 'semantic-ui-react';
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List,
} from 'react-virtualized';

import useDebounce from '../../hooks/useDebounce';
import { IRegion } from '../../interfaces/Region';

import './RegionList.css';

interface RegionsListProps {
  onChange: (regionId: string) => void;
  data: IRegion[];
}

declare var Ext: any;

const RegionsList: React.FC<RegionsListProps> = ({
  onChange,
  data = [],
}) => {
  const [items, setItems] = useState(data);
  const [filteredItems, setFilteredItems] = useState(data);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    setItems(data);
    setFilteredItems(data);
  }, [data]);

  const store = Ext.create('Ext.data.Store', {
    autoLoad: true,
    data: filteredItems,
    sorters: ['p01'],
  });

  const handleSearch = (
    _: React.ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData,
  ) => {
    const text = data.value.toLowerCase();
    setQuery(text);
  };

  useEffect(() => {
    const newItems = items.filter((item) => {
      return (
        item.p01 && item.p01.toLowerCase().includes(debouncedQuery)
      );
    });
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
          className="row"
          onClick={() => onChange(item.p00)}
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
