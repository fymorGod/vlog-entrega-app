import styled from "styled-components/native";


export const Container = styled.View`
    flex: 1;
    overflow: hidden;
    position: relative;
    background-color: #fff;
    align-items: center;
`

export const CardInfo = styled.View`
    width: 100%;
    height: 260px;
    margin: 0 auto;
    padding: 20px 10px;
    background-color: #f4f2f2;
    border-bottom-right-radius: 30px;
    border-bottom-left-radius: 30px;
    box-shadow: 2px 2px 0 rgba(0, 0, 0, .1);
    flex-direction: column;
    align-items: start;
`
export const TextInfo = styled.Text`
    font-weight: 700;
    font-size: 18px;
`
export const TextInfoImage = styled.Text`
    font-weight: 500;
    font-size: 18px;
    text-align:  right;
    margin-right: 10px;
    color: #262626;
`
export const CardInfoImages = styled.View`
    width: 100%;
    height: 200px;
    justify-content: center;
    padding: 10px;
`

export const TextSpan = styled.View`
    width: 80%;
    margin-top: 10px;
    flex-direction: row; 
    align-items: center;
`
export const ToggleCamera = styled.View`
    width: 80%;
    flex-direction: row;
    margin-bottom: 20px;
`