import React from 'react';
import classnames from 'classnames';
import { usePagination, DOTS } from '../../hooks/usePagination.js'
import '../../styles/memories.css'
import {v4 as uuidv4} from 'uuid'
//tutorial followed: https://www.freecodecamp.org/news/build-a-custom-pagination-component-in-react/
export const Pagination = props => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    className
  } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize
  });

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];
  return (
    <ul className={classnames('pagination-container', { [className]: className })}>
      <li key={uuidv4()}
        className={classnames('pagination-item', {
          disabled: currentPage === 1
        })}
        onClick={onPrevious}>
        <div className="arrow left" />
      </li>
      {paginationRange.map(pageNumber => {
        if (pageNumber === DOTS) {
          return <li key={uuidv4()} className="pagination-item dots">&#8230;</li>;
        }

        return (
          <li key={uuidv4()} className={classnames('pagination-item', {
              selected: pageNumber === currentPage
            })}
            onClick={() => onPageChange(pageNumber)}>
            {pageNumber}
          </li>
        );
      })}
      <li key={uuidv4()}
        className={classnames('pagination-item', {
          disabled: currentPage === lastPage
        })}
        onClick={onNext}>
        <div className="arrow right" />
      </li>
    </ul>
  );
};