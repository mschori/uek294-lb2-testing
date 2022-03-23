import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Counter from './FunctionalComponent';
import CounterClass from './ClassComponent';

export default function BootstrapComponents() {

    return (
        <Container className={'mt-5'}>
            <Row className={'justify-content-center'}>
                <Col>
                    <Button type={"button"} variant={"primary"}>Primary-Color</Button>
                </Col>
                <Col>
                    <Button type={"button"} variant={"danger"}>Danger-Color</Button>
                </Col>
            </Row>
            <Row className={'justify-content-center mt-5'}>
                <Col xs md lg={3}>
                    <Counter initialCounter={5}/>
                </Col>
                <Col xs md lg={3}>
                    <CounterClass initialCounter={50}/>
                </Col>
            </Row>
        </Container>
    );
}
