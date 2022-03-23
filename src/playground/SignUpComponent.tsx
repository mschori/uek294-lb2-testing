import * as React from 'react';
import Select from 'react-select';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

interface IFormProps {
    // No special conditions
}

interface IValues {
    formFirstname: string,
    formLastname: string,
    formAddress: string,
    formPostcode: string,
    formCity: string,
    formCountry: string,
    formEmail: string,
    formUsername: string,
    formPassword: string,
    formPasswordRepeat: string,
    formBirthdate: string,
    formIdUpload: File | null,
    formTermsConditions: boolean,
}

interface IErrors {
    [key: string]: string;
}

interface IFormState {
    values: IValues,
    errors: IErrors,
    countryOptions: ICountry[],
    isValidated: boolean,
    signUpSuccess: boolean
}

interface ICountry {
    label: string,
    value: string
}

export default class SignUpComponent extends React.Component<IFormProps, IFormState> {
    private allowedFileTypes: string[] = [
        'application/pdf',
        'image/jpeg'
    ];

    constructor(props: IFormProps) {
        super(props);

        const values: IValues = {
            formFirstname: 'Michael',
            formLastname: 'Scott',
            formAddress: 'Street 12',
            formPostcode: '3076',
            formCity: 'New York',
            formCountry: 'Switzerland',
            formEmail: 'michael@schori-liem.ch',
            formUsername: 'MichaelScott',
            formPassword: 'Sml12345',
            formPasswordRepeat: 'Sml12345',
            formBirthdate: '2022-03-08',
            formIdUpload: null,
            formTermsConditions: true,
        }
        const errors: IErrors = {}

        this.state = {
            values,
            errors,
            countryOptions: [],
            isValidated: false,
            signUpSuccess: false
        }
    }

    componentDidMount() {
        this.getCountryOptions();
    }

    private getCountryOptions() {
        let countryOptions: ICountry[] = [];

        axios.get('https://restcountries.com/v3.1/all')
            .then(response => {
                response.data.forEach(function (country: any) {
                    countryOptions.push({label: country.name.common, value: country.flags.png});
                })
                this.setState({countryOptions: countryOptions})
            });
    }

    private renderCountryOptions = (props: any) => {
        const {innerProps, innerRef} = props;
        return (
            <div ref={innerRef} {...innerProps}>
                <img src={props.data.value} style={{width: 30}} alt=""/>
                <span className={'ms-2'}>{props.data.label}</span>
            </div>
        );
    };

    onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({values: {...this.state.values, [e.target.id]: e.target.value}});
        if (e.target.type === 'checkbox') {
            this.setState({values: {...this.state.values, [e.target.id]: e.target.checked}})
        }
        if (e.target.type === 'file') {
            if (e.target.files!.length > 0) {
                this.setState({values: {...this.state.values, [e.target.id]: e.target.files![0]}})
            }
        }
    };

    hasError(formId: string): boolean {
        return this.state.errors[formId]?.length > 0;
    }

    private validateForm(): boolean {
        // Clean error-messages
        this.setState({errors: {}})

        // Validate passwordRepeat
        if (this.state.values.formPassword !== this.state.values.formPasswordRepeat) {
            this.setState({errors: {...this.state.errors, formPasswordRepeat: 'Has to be the same password.'}})
            return false;
        }

        // Validate idUpload
        if (!this.allowedFileTypes.includes(this.state.values.formIdUpload!.type)) {
            this.setState({errors: {...this.state.errors, formIdUpload: 'Please select a jpg or pdf.'}})
            return false;
        }

        // Validate birthdate
        if (new Date(this.state.values.formBirthdate) >= new Date()) {
            this.setState({
                errors: {
                    ...this.state.errors,
                    formBirthdate: 'Please select a valid date before the current day.'
                }
            })
            return false;
        }

        return true;
    }

    private generateData(): FormData {
        const formData = new FormData()
        formData.append("name", `${this.state.values.formFirstname} ${this.state.values.formLastname}`)
        formData.append('address', this.state.values.formAddress)
        formData.append('city', this.state.values.formCity)
        // TODO Phone-Number
        formData.append('phoneNumber', '+41795302487')
        formData.append('postcode', this.state.values.formPostcode)
        formData.append('country', this.state.values.formCountry)
        formData.append('username', this.state.values.formUsername)
        formData.append('email', this.state.values.formEmail)
        formData.append('password', this.state.values.formPassword)
        formData.append('dateOfBirth', this.state.values.formBirthdate)
        // @ts-ignore
        formData.append('idConfirmation', this.state.values.formIdUpload);
        return formData;
    }

    private handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();
        if (this.validateForm()) {
            axios.post('http://localhost:3002/login', this.generateData())
                .then(response => {
                    if (response.status === 200) {
                        console.log('Success!!!!!')
                    }
                }).catch(err => {
                if (err.response.status === 405) {
                    if (err.response.data === 'Username already taken') {
                        this.setState({errors: {...this.state.errors, formUsername: 'Username already taken...'}})
                    } else if (err.response.data === 'Email already taken') {
                        this.setState({errors: {...this.state.errors, formEmail: 'Email already taken...'}})
                    } else if (err.response.data === 'Both already taken') {
                        this.setState({errors: {...this.state.errors, formUsername: 'Username already taken...'}})
                        this.setState({errors: {...this.state.errors, formEmail: 'Email already taken...'}})
                    }
                } else {
                    console.log('Unknown error...')
                }
            });
        }
    };

    render() {
        return (
            <div>
                <Container>
                    <Row style={{height: '100vh'}} className={'justify-content-center align-items-center'}>
                        <Col xs md lg={6}>
                            <div className={'display-4 text-center m-4'}>Sign up</div>
                            <Form onSubmit={this.handleSubmit} validated={this.state.isValidated}>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="formFirstname">
                                            <Form.Label>Firstname</Form.Label>
                                            <Form.Control type="text" placeholder="Your firstname"
                                                          onChange={this.onChange}
                                                          value={this.state.values.formFirstname}
                                                          required
                                                          isInvalid={this.hasError('formFirstname')}/>
                                            <Form.Control.Feedback type={'invalid'}>
                                                {this.state.errors.formFirstname}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="formLastname">
                                            <Form.Label>Lastname</Form.Label>
                                            <Form.Control type="text" placeholder="Your lastname"
                                                          onChange={this.onChange}
                                                          value={this.state.values.formLastname}
                                                          required
                                                          isInvalid={this.hasError('formLastname')}/>
                                            <Form.Control.Feedback type={'invalid'}>
                                                {this.state.errors.formLastname}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="formAddress">
                                            <Form.Label>Address</Form.Label>
                                            <Form.Control type="text" placeholder="Your address"
                                                          onChange={this.onChange}
                                                          value={this.state.values.formAddress}
                                                          required
                                                          isInvalid={this.hasError('formAddress')}/>
                                            <Form.Control.Feedback type={'invalid'}>
                                                {this.state.errors.formAddress}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="formPostcode">
                                            <Form.Label>Postcode</Form.Label>
                                            <Form.Control type="text" placeholder="Your postcode"
                                                          onChange={this.onChange}
                                                          value={this.state.values.formPostcode}
                                                          required
                                                          isInvalid={this.hasError('formPostcode')}/>
                                            <Form.Control.Feedback type={'invalid'}>
                                                {this.state.errors.formPostcode}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="formCity">
                                            <Form.Label>City</Form.Label>
                                            <Form.Control type="text" placeholder="Your city" onChange={this.onChange}
                                                          value={this.state.values.formCity}
                                                          required
                                                          isInvalid={this.hasError('formCity')}/>
                                            <Form.Control.Feedback type={'invalid'}>
                                                {this.state.errors.formCity}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="formCountry">
                                            <Form.Label>Country</Form.Label>
                                            <Select options={this.state.countryOptions}
                                                    components={{Option: this.renderCountryOptions}}
                                                    onChange={e => {
                                                        this.setState({
                                                            values: {
                                                                ...this.state.values,
                                                                formCountry: e!.label
                                                            }
                                                        });
                                                    }}/>
                                            <Form.Control.Feedback type={'invalid'}>
                                                {this.state.errors.formCountry}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="formEmail">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control type="email" placeholder="Your Email" onChange={this.onChange}
                                                          value={this.state.values.formEmail}
                                                          required
                                                          isInvalid={this.hasError('formEmail')}/>
                                            <Form.Control.Feedback type={'invalid'}>
                                                {this.state.errors.formEmail}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="formUsername">
                                            <Form.Label>Username</Form.Label>
                                            <Form.Control type="text" placeholder="Your username"
                                                          onChange={this.onChange}
                                                          value={this.state.values.formUsername}
                                                          required
                                                          isInvalid={this.hasError('formUsername')}/>
                                            <Form.Control.Feedback type={'invalid'}>
                                                {this.state.errors.formUsername}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="formPassword">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control type="password" placeholder="Your password"
                                                          onChange={this.onChange}
                                                          value={this.state.values.formPassword}
                                                          required
                                                          isInvalid={this.hasError('formPassword')}/>
                                            <Form.Control.Feedback type={'invalid'}>
                                                {this.state.errors.formPassword}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="formPasswordRepeat">
                                            <Form.Label>Confirm password</Form.Label>
                                            <Form.Control type="password" placeholder="Your password"
                                                          onChange={this.onChange}
                                                          value={this.state.values.formPasswordRepeat}
                                                          required
                                                          isInvalid={this.hasError('formPasswordRepeat')}/>
                                            <Form.Control.Feedback type={'invalid'}>
                                                {this.state.errors.formPasswordRepeat}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="formBirthdate">
                                            <Form.Label>Birthdate</Form.Label>
                                            <Form.Control type="date" placeholder="Your birthdate"
                                                          onChange={this.onChange}
                                                          value={this.state.values.formBirthdate}
                                                          required
                                                          isInvalid={this.hasError('formBirthdate')}/>
                                            <Form.Control.Feedback type={'invalid'}>
                                                {this.state.errors.formBirthdate}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="formIdUpload">
                                            <Form.Label>ID-Scan</Form.Label>
                                            <Form.Control type="file" placeholder="Your id confirmation"
                                                          onChange={this.onChange}
                                                          required
                                                          isInvalid={this.hasError('formIdUpload')}/>
                                            <Form.Control.Feedback type={'invalid'}>
                                                {this.state.errors.formIdUpload}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="formTermsConditions">
                                            <Form.Check type="checkbox"
                                                        label="I have read and accepted all terms and conditions as written here."
                                                        onChange={this.onChange}
                                                        checked={this.state.values.formTermsConditions}
                                                        required/>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
