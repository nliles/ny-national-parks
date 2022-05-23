import { useState, useEffect, useRef } from "react";
import List from "../List";
import usePark from "../../../hooks/usePark";
import useParks from "../../../hooks/useParks";
import { stripPunctuation } from "../../../helpers/stripPunctuation";

const Container = () => {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const listRef = useRef(null);
  const { isFetching, setIsFetching, parks, error, total } =
    useParks(pageNumber);
  const { parks: filteredParks, loading } = usePark({
    query,
    searchByCode: false,
  });

  useEffect(() => {
    if (isFetching && parks.length < total) {
      setPageNumber((prevNumber) => prevNumber + 1);
    }
  }, [isFetching, parks, total]);

  const handleScroll = () => {
    const scrolled =
      listRef.current.scrollHeight -
        listRef.current.scrollTop -
        listRef.current.clientHeight <
      1;
    if (scrolled) {
      setIsFetching(true);
    }
  };

  const handleInputChange = (event) => {
    const query = event.target.value;
    setQuery(query);
  };

  const filteredData = filteredParks.filter((element) => {
    return stripPunctuation(element.fullName).includes(stripPunctuation(query));
  });

  const displayData = query ? filteredData : parks;

  return (
    <List
      error={error}
      ref={listRef}
      loading={loading}
      parks={displayData}
      handleScroll={handleScroll}
      handleInputChange={handleInputChange}
      query={query}
    />
  );
};

export default Container;
