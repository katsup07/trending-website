import { useEffect } from 'react';
import TrendsList from '../../components/TrendsList';
import { useTrendingStore } from '../../store';

const MovieTrends = () => {
  const setSortTrendsBy = useTrendingStore(store => store.setSortTrendsBy);
  useEffect(() => setSortTrendsBy('likesToDislikesRatio'),[]);
	return <TrendsList trendType='movies' />;
};

export default MovieTrends;
