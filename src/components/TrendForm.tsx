import { FieldValues, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import { createTrend } from '../services/apiTrends';
import { updateTrend } from '../services/apiTrends';
import { useMutation } from '@tanstack/react-query';
import { TrendData } from '../interfaces/trend';
import { useNavigate, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTrendingStore } from '../store';
import { StyledForm } from '../components/CssComponents/StyledComponents';

interface Props {
	heading?: string;
	formTitle: string;
	initialFormFields?: FormFields;
	formButtonText?: string;
	onSetParentsLocalState?: (trend: TrendData, id: number) => void;
}

interface FormFields {
	id: number;
	title: string;
	content: string;
	image: string;
	category: string;
	author_privacy: string;
}

// ! TODO 1) Refactor this into multiple components
// ! TODO 2) Validate user input. Limit description to 300 characters.
// When logged in, this option will appear
const TrendForm = ({
	heading,
	formTitle,
	formButtonText = 'create',
	initialFormFields,
  onSetParentsLocalState,
}: Props) => {
	const { register, setValue, handleSubmit } = useForm();
	const navigate = useNavigate();
	const [category, setCategory] = useState('');
	const [formFields, setFormFields] = useState(initialFormFields);
	const username = useTrendingStore((store) => store.username);
	const theme = useTrendingStore((store) => store.theme);
	const authToken = useTrendingStore((store) => store.authToken);
	const user_id = useTrendingStore((store) => store.user_id);

	// initialize form fields
	useEffect(() => {
		setValue('title', formFields?.title);
		setValue('content', formFields?.content);
		setValue('image', formFields?.image);
		setValue('category', formFields?.category);
		setValue('privacy', formFields?.author_privacy);
	}, []);

	// create new trend
	const {
		isSuccess,
		isError,
		error,
		mutate: mutateCreate,
	} = useMutation((trend: TrendData) => createTrend(trend));

	// edit trend // updateTrend(-1) should never happen and will do nothing if it does, since ids start from 1.
	const { isSuccess: isUpdateSuccess, isError: isUpdateError, error: updateError, mutate: mutateUpdate } = useMutation((trend: TrendData) =>
		updateTrend(trend, initialFormFields?.id || -1)
	);

	const err: any = error;
	const kebabCaseify = (str: string) => {
		return str.split(' ').join('-');
	};
	const onSubmit = ({
		content,
		image,
		title,
		category,
		privacy,
	}: FieldValues) => {
    console.log(category);
		setCategory(kebabCaseify(category));

		const newTrend = {
			content,
			image,
			alt: title,
			category,
			likes: 0,
			dislikes: 0,
			author: privacy === 'private' ? 'anonymous' : username,
			author_privacy:
				initialFormFields?.author_privacy || privacy === 'private'
					? 'private'
					: 'public',
			user_id,
		};
		console.log('creating newTrend...', newTrend);

		//edit
		if (initialFormFields && onSetParentsLocalState){
      console.log('Editing trend mode...');
      mutateUpdate(newTrend);
      onSetParentsLocalState(newTrend, initialFormFields.id);
  }
		else mutateCreate(newTrend);
    
	}

  if (isError) toast.error('Something went wrong...' + err.message);

  if(isUpdateSuccess)
    toast.success('Updating trend...');

	if (isSuccess) {
        toast.success('Creating new trend...');
        // setTimeout(() => navigate(-1), 1000);
        navigate(`/${category}-trends`);
	}

	

	if (!authToken)
		return (
			<p>
				Users must {<NavLink to='/auth'>login</NavLink>} before creating a
				trend.
			</p>
		);

	return (
		<StyledForm setting={theme}>
			<Heading>{formTitle}</Heading>
			<form onSubmit={handleSubmit(onSubmit)}>
				<FormControl className='form-control'>
					<label id='title' htmlFor='title'>
						Title
					</label>
					<input autoFocus placeholder='Title' {...register('title')} />
				</FormControl>
				<FormControl className='form-control'>
					<label id='content' htmlFor='content'>
						Content
					</label>
					<textarea
						maxLength={300}
						rows={5}
						placeholder='Describe the trend in under 300 characters.'
						{...register('content')}
					/>
				</FormControl>
				<FormControl className='form-control'>
					<label id='image' htmlFor='image'>
						Image
					</label>
					<input placeholder='Add a picture link.' {...register('image')} />
				</FormControl>
				<FormControl>
					<label id='category' htmlFor='category'>
						Category
					</label>
					<select id='category' {...register('category')}>
						<option value='clothing'>Clothing</option>
						<option value='movies'>Movies</option>
						<option value='music'>Music</option>
						<option value='video and tv'>Video and TV</option>
						<option value='technology'>Technology</option>
					</select>
				</FormControl>
				<FormControl>
					<div className='privacy'>
						<div className='public'>
							<input
								type='radio'
								id='public'
								value='public'
								{...register('privacy')}
							/>
							<label className='public' htmlFor='public'>
								Public<span className='small-text'>[Post as "{username}"]</span>
							</label>
						</div>
						<div className='private'>
							<input
								type='radio'
								id='private'
								value='private'
								{...register('privacy')}
							/>
							<label className='private' htmlFor='private'>
								Private<span className='small-text'>[Post anonymously]</span>
							</label>
						</div>
					</div>
				</FormControl>
				<Button>{formButtonText}</Button>
			</form>
		</StyledForm>
	);
};

export default TrendForm;

export const Heading = styled.h1`
	font-size: 1.6rem;
	text-align: center;
`;

export const FormControl = styled.div`
	display: flex;
	flex-direction: column;

	.privacy {
		display: flex;
		margin: 0;
		padding: 0;
		gap: 1rem;
	}

	.private,
	.public {
		font-size: 0.7rem;
	}

	.small-text {
		font-size: 0.5rem;
	}
`;

export const Button = styled.button`
	margin: 0.5rem 0;
	padding: 0.1rem 0.8rem;
	font-size: 0.9rem;
	display: block;
`;