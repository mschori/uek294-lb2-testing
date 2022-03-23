import React, {useState} from 'react';
import {Container, Row, Col, Form, Button} from 'react-bootstrap';

export default function Calculator() {

    const [inputOne, setInputOne] = useState<string>('');
    const [inputTwo, setInputTwo] = useState<string>('');
    const [result, setResult] = useState<string>('');
    const [inputOneIsValid, setInputOneIsValid] = useState<boolean>(false);
    const [inputTwoIsValid, setInputTwoIsValid] = useState<boolean>(false);

    const calculate = () => {
        let isValidOne = isNaN(Number(inputOne));
        let isValidTwo = isNaN(Number(inputTwo));

        setInputOneIsValid(isValidOne);
        setInputTwoIsValid(isValidTwo);

        if (!isValidOne && !isValidTwo){
            setResult((Number(inputOne) + Number(inputTwo)).toString());
        }else{
            setResult('----')
        }
    }

    return (
        <Container>
            <Row>
                <Col>
                    <Form>
                        <Form.Group as={Col} md="4" controlId="validationCustom01">
                            <Form.Label>Input 1</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                value={inputOne}
                                placeholder="Your first number"
                                isInvalid={inputOneIsValid}
                                onChange={(event => setInputOne(event.target.value))}
                            />
                            <Form.Control.Feedback type={'invalid'}>Please use a number.</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="4" controlId="validationCustom02">
                            <Form.Label>Input 2</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                value={inputTwo}
                                placeholder="Your second number"
                                isInvalid={inputTwoIsValid}
                                onChange={(event => setInputTwo(event.target.value))}
                            />
                            <Form.Control.Feedback type={'invalid'}>Please use a number.</Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col>
                    Result: {result}
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button onClick={calculate} variant={'primary'}>Calculate it</Button>
                </Col>
            </Row>
        </Container>
    )
}
