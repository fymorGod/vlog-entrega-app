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
    height: 350px;
    margin: 0 auto;
    padding: 10px 10px;
    background-color: #f2f2f2;
    border-bottom-right-radius: 30px;
    border-bottom-left-radius: 30px;
    box-shadow: 2px 2px 0 rgba(0, 0, 0, .05);
    flex-direction: column;
    align-items: start;
`
export const TextInfo = styled.Text`
    font-weight: 600;
    font-size: 18px;
`
export const TextSpan = styled.View`
    width: 80%;
    margin-left: 20px;
    margin-top: 10px;
    flex-direction: row; 
    align-items: center;
`
export const ToggleCamera = styled.View`
    width: 80%;
    margin-top: 10px;
    position: absolute;
    flex-direction: row;
    bottom: 0;
    margin-bottom: 30px;
`