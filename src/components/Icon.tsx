import { TbShirtFilled, TbMovie, TbMusic, TbCpu2, TbDeviceTv } from 'react-icons/tb';
import { FaPhotoVideo } from 'react-icons/fa';
import styled from 'styled-components';

interface Props {
	icon: string;
}

const Icon = ({ icon }: Props) => {
	const icons: any = {
		movie: <TbMovie />,
		clothing: <TbShirtFilled />,
		music: <TbMusic />,
		videoAndTv: <TbDeviceTv />,
		technology: <TbCpu2 />,
	};

	return <IconStyles>{icons[icon]}</IconStyles>;
};

export default Icon;

const IconStyles = styled.span`
  display: flex;
  justify-content: center;
  font-size: 1.5rem;

  @media only screen and (max-width: 500px) {
    font-size: 1rem;
	}
`
