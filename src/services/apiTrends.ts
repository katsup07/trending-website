import { Trend, TrendData } from '../interfaces/trend';
import { sortTrends } from '../utility/sorters';
import supabase from './supabase';


// == Trends ==
export const getTrends = async () => {
	const { data, error } = await supabase
		.from('trends')
		.select('*')
		.order('likes', { ascending: false });

	if (error) {
		console.log(error);
		throw error;
	}

  const trends: any[] = data;
	return sortTrends(trends);
};

export const getTrend = async(id: number): Promise<Trend> => {
  const { data: trends, error } = await supabase
  .from('trends')
  .select("*")
  .eq('id', id);

  if (error) {
		console.log(error);
		throw error;
	}

  return trends[0];
}

export const createTrend = async (trend: TrendData): Promise<Trend> => {
	const { data, error } = await supabase.from('trends').insert([trend]).select();
	if (error) {
		console.log(error);
		throw error;
	}

	return data[0];
};

export const updateTrend = async(trend: TrendData, trendId: number): Promise<Trend> => {
  const {content, image, alt, category, author, author_privacy} = trend;
  const { data, error } = await supabase
  .from('trends')
  .update({ content, image, alt, category, author, author_privacy })
  .eq('id', trendId)
  .select();

  if (error) {
		console.log(error);
		throw error;
	}

	return data[0];
}

export const deleteTrend = async (trendId: number) => {
	const { error, data } = await supabase
  .from('trends')
  .delete()
  .eq('id', trendId)
  .select();

	if (error) {
		console.log(error);
		throw error;
	}

  return data;
};


// == Views ==
export const updateViewCount = async(value: number, id: number) => {
  const { data, error } = await supabase
  .from('trends')
  .update({ views: value })
  .eq('id', id)
  .select();

  if (error) {
		console.log(error);
		throw error;
	}

  return data[0].views;
}

// == Votes ==
export const getLikesAndDislikes = async(id: number) => {
  const {alt, likes, dislikes} = await getTrend(id);
  
  return {id, title: alt, likes, dislikes};
}

export const updateLikesOrDislikes = async (info: {id: number, value: number, type: 'likes' | 'dislikes'}) => {
  const {id, value, type} = info;
	const { data, error } = await supabase
		.from('trends')
		.update({ [type]: value })
		.eq('id', id)
    .select();


	if (error) {
		console.log(error);
		throw error;
	}
  
	return data[0];
};

export const updateVotedList = async(trendId: number, user_id: string) => {
  const alreadyVotedList: string[] = await getVotedList(trendId);
  const { data, error } = await supabase
  .from('trends')
  .update({ alreadyVotedList: [...alreadyVotedList, user_id] })
  .eq('id', trendId)
  .select()

  if (error) {
		console.log(error);
		throw error;
	}

  return data;
}

const getVotedList = async(trendId: number) => {
  const { data: trends, error } = await supabase
  .from('trends')
  .select('alreadyVotedList')
  .eq('id', trendId);

  if (error) {
   console.log(error);
   throw error;
  }
  
  return trends[0].alreadyVotedList;
}

export const isAlreadyInVotedList = async(trendId: number, user_id: string) => {
  const alreadyVotedList: string[] = await getVotedList(trendId);
  return alreadyVotedList.some(uid => uid === user_id);
}