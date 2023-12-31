import { FieldValues, useForm } from 'react-hook-form';
import { FormControl } from './TrendForm';
import { useMutateCreateComment } from '../hooks/useMutateCreateComment';
import toast from 'react-hot-toast';
import { Button } from './TrendForm';
import styled from 'styled-components';
import { useTrendingStore } from '../store';
import { IStyledProps } from '../interfaces/cssComponentStyles';
import { StyledForm } from './CssComponents/StyledComponents';

interface Props {
	username: string;
	id: number;
}

// ! Add input validation to improve UX
const CommentForm = ({ username, id }: Props) => {
	const [theme, trends, user_id] = useTrendingStore((store) => [
		store.theme,
		store.trends,
    store.user_id,
	]);
	const { register, handleSubmit } = useForm();
	const {
		isError: isCommentError,
		error: commentErr,
		mutate: mutateComments,
	} = useMutateCreateComment();
	const commentError: any = commentErr;
	console.log(trends);
	// Commenting
	const onSubmitComment = ({ commentContent }: FieldValues) => {
		const newComment = {
			trend_id: id,
			trend_title: trends?.find((trend) => trend.id === id)?.alt || '',
			content: commentContent,
			author: username,
      user_id,
		};
		mutateComments(newComment);

		if (isCommentError) return toast.error(commentError.message);

		toast.success('Adding comment...');
	};

	return (
		<StyledCommentForm setting={theme}>
			<StyledForm setting={theme}>
				<h2>New Comment</h2>
				<form onSubmit={handleSubmit(onSubmitComment)}>
					<FormControl className='form-control'>
						<textarea
							maxLength={300}
							rows={3}
							placeholder='Leave a comment. Max 300 characters.'
							{...register('commentContent')}
						/>
					</FormControl>
					<Button>Send</Button>
				</form>
			</StyledForm>
		</StyledCommentForm>
	);
};

export default CommentForm;

//CSS Components
const StyledCommentForm = styled.div<IStyledProps>`
	${(props) =>
		props.setting === 'light'
			? 'color:  var(--color-black-500);'
			: 'color:  var(--color-grey-500);'};

	h2 {
		${(props) =>
			props.setting === 'light'
				? 'color:  var(--color-indigo-50);'
				: 'color:  var(--color-pink-100);'};
		font-size: 1.2rem;
	}
	@media only screen and (max-width: 500px) {
		h2 {
			font-size: 1rem;
		}
	}
`;
