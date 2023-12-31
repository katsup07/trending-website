import styled from 'styled-components';
import { IStyledProps } from '../interfaces/cssComponentStyles';

interface Props {
	children?: any;
	title?: string;
	buttonText?: string;
  maxHeight?: string;
	onCloseModal: () => void;
}

const Modal = ({
	children = '',
	title = '',
	buttonText = 'close',
  maxHeight,
	onCloseModal,
}: Props) => {

  const onBackgroundClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if((e.target as Element)['classList'][2] === 'outer') // close on click outside modal
      onCloseModal();
  }
	return (
		<OutterModalStyles className='outer' onClick={onBackgroundClick}>
      <ModalStyles maxHeight={maxHeight} onClick={onBackgroundClick}>
        <div className='container'>
          <h1 className='title'>{title}</h1>
          <div className='content'>{children}</div>
          <div className='button-container'>
            <button className='close-button' onClick={() => onCloseModal()}>{buttonText}</button>
          </div>
        </div>
      </ModalStyles>
    </OutterModalStyles>
	);
};

export default Modal;

// CSS Components
const ModalStyles = styled.div<IStyledProps>`
	background: #0091ff78;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
  margin: 5% 12%;
  border-radius: 0.1rem;

  ${props => props.maxHeight ? 'max-height: ' + props.maxHeight : 'max-height: 100vh'};
  ${props => props.maxHeight ? 'display: flex; justify-content: center; align-items: center;' : 'display: block'};
  .container{
    ${props => props.maxHeight ? 'width: 100vw' : ''}; 
  }



	button{
    padding: 0 0.3rem;
    font-size: 0.7rem;
  }

  .outer{

  }
  
  .button-container {
    text-align: center;
	}


  @media only screen and (max-width: 500px) {
    max-height: 100vh;
    font-size: 0.7rem;
    margin: 0;
	}
`;

const OutterModalStyles = styled.div`
  position: fixed;
  top: 0;
	left: 0;
	right: 0;
	bottom: 0;
  background-color: #1e201f46;
  backdrop-filter: blur(4px);
  @media only screen and (max-width: 900px) {
    
	}
`
