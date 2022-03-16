import styled from 'styled-components/native';

export const InnerStyledView = styled.View`
    background-color: #b5b5b5;
    margin:10px;
    padding:10px;
    border-radius:10px;
`;

export const SplitView = styled.View`
    display:flex;
    flex-direction:row;
    justify-content:flex-start;
    margin-bottom:5px;
`;

export const SplitViewBetween = styled.View`
    display:flex;
    flex-direction:row;
    justify-content:space-between;
    margin-bottom:5px;
`;

export const SplitViewAround = styled.View`
    display:flex;
    flex-direction:row;
    justify-content:space-around;
    margin-bottom:5px;
`;

export const SplitViewRight = styled.View`
    display:flex;
    flex-direction:row;
    justify-content:flex-end;
    margin-bottom:5px;
`;

export const NameText = styled.Text`
    font-weight:bold;
    font-size:20px;
`;

export const SubText = styled.Text`
    font-weight:bold;
    font-size:16px;
`;

export const OneLineText = styled.View`
    display:flex;
    flex-direction:row;
`;

export const AddMargin = styled.View`
    margin:5px;
`;


