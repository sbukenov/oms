import React from 'react';
import styled from 'styled-components';
import Select, { SelectProps } from 'antd/lib/select';

export const SelectStyled = styled<React.FC<SelectProps>>(Select)`
    width: 200px;
`;

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
`;
