import React, {useState, useEffect} from 'react';
import axios from "axios";
import {BsFillCheckCircleFill, BsFillXCircleFill} from "react-icons/bs"
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Select, {SingleValue} from "react-select";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
// @ts-ignore
import ReCAPTCHA from 'react-google-recaptcha';
import 'react-phone-input-2/lib/style.css'
import {Navigate} from 'react-router-dom';


interface IErrors {
    [key: string]: string;
}

interface ICountry {
    label: string,
    value: string
    phonePre: string,
}

const styles = {
    dangerFeedback: {
        width: '100%',
        marginTop: '0.25rem',
        fontSize: '.875em',
        color: '#dc3545',
    },
}

export default function SignUpComponentFunctional() {

    const allowedFileTypes: string[] = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    const allowedFileSize: number = 3; // MegaBytes

    const [registrationSuccessfull, setRegistrationSuccessfull] = useState<boolean>(false);
    const [countryOptions, setCountryOptions] = useState<ICountry[]>([{label: '', value: '', phonePre: '+41'}]);
    const [errors, setErrors] = useState<IErrors>({});
    const [firstname, setFirstname] = useState<string>('');
    const [lastname, setLastname] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [phonePre, setPhonePre] = useState<string>('');
    const [phonenumber, setPhonenumber] = useState<string>('');
    const [postcode, setPostcode] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [country, setCountry] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [usernameValidationResult, setUsernameValidationResult] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [passwordValidationResult, setPasswordValidationResult] = useState<boolean[]>([false, false, false]);
    const [passwordRepeat, setPasswordRepeat] = useState<string>('');
    const [birthdate, setBirthdate] = useState<string>('');
    const [idUpload, setIdUpload] = useState<File | null>(null);
    const [termConditions, setTermsConditions] = useState<boolean>(false);
    const [captchaIsValid, setCaptchaIsValid] = useState<boolean>(false);

    useEffect(() => {
        getCountryOptions();
    }, []);

    function onCaptchaChange(value: string) {
        const secretKey = "6LcLHc8eAAAAAAdWx_rKchrtN5MC9rt5QbhGRRtd";
        const verificationUrl = 'http://localhost:8080/https://www.google.com/recaptcha/api/siteverify?secret=' + secretKey + '&response=' + value;
        axios.post(verificationUrl)
            .then(response => {
                console.log(response);
                if (response.data.success) {
                    setCaptchaIsValid(true);
                } else {
                    setCaptchaIsValid(false);
                }
            })
            .catch(err => {
                console.log(err);
                setCaptchaIsValid(false);
            })
    }

    const getCountryOptions = () => {
        let countryOptions: ICountry[] = [];

        axios.get('https://restcountries.com/v3.1/all')
            .then(response => {
                response.data.forEach(function (country: any) {
                    countryOptions.push({
                        label: country.name.common,
                        value: country.flags.png,
                        phonePre: country.idd.root ? `${country.idd?.root}${country.idd?.suffixes[0]}` : 'NF'
                    });
                })
                countryOptions = countryOptions.sort((obj1: ICountry, obj2: ICountry) => {
                    if (obj1.label > obj2.label) {
                        return 1;
                    }
                    if (obj1.label < obj2.label) {
                        return -1;
                    }
                    return 0;
                })
                setCountryOptions(countryOptions);
            });
    }

    const setCountryAndPhonePre = (event: SingleValue<ICountry>) => {
        setCountry(event!.label);
        setPhonenumber(`${event!.phonePre} ${phonenumber.replace(phonePre, '').replace(' ', '')}`);
        setPhonePre(event!.phonePre);
    }

    const renderCountryOptions = (props: any) => {
        const {innerProps, innerRef} = props;
        return (
            <div ref={innerRef} {...innerProps}>
                <img src={props.data.value} style={{width: 30}} alt=""/>
                <span className={'ms-2'}>{props.data.label}</span>
            </div>
        );
    };

    const validateUsername = (): void => {
        username.length < 5 ? setUsernameValidationResult(false) : setUsernameValidationResult(true);
    }

    const validatePassword = (): void => {
        let results = [false, false, false];
        let formatSC = /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;
        let formatNu = /\d/;
        password.length < 8 ? results[0] = false : results[0] = true;
        formatSC.test(password) ? results[1] = false : results[1] = true;
        formatSC.test(password) ? results[1] = true : results[1] = false;
        formatNu.test(password) ? results[2] = true : results[2] = false;
        setPasswordValidationResult(results);
    }

    const validatePasswordRepeat = (): boolean => {
        if (password !== passwordRepeat) {
            setErrors(current => {
                return {
                    ...current,
                    passwordRepeat: 'Has to be the same password.',
                }
            })
            return false;
        }
        setErrors(current => {
            delete current.passwordRepeat;
            return {
                ...current
            }
        })
        return true;
    }

    const hasError = (formId: string): boolean => {
        return errors[formId]?.length > 0;
    }

    const validateForm = (): boolean => {
        // Clean error-messages
        setErrors({})
        let validationSuccess: boolean = true;

        // Validate username
        if (!usernameValidationResult) {
            setErrors(current => {
                return {
                    ...current,
                    username: 'You have to fulfill the requirements.',
                }
            })
            validationSuccess = false;
        }

        // Validate password
        if (!passwordValidationResult[0] || !passwordValidationResult[1] || !passwordValidationResult[2]) {
            setErrors(current => {
                return {
                    ...current,
                    password: 'You have to fulfill all requirements.',
                }
            })
            validationSuccess = false;
        }

        if (!validatePasswordRepeat()) {
            validationSuccess = false;
        }

        // Validate country
        if (!(country.length > 3)) {
            setErrors(current => {
                return {
                    ...current,
                    country: 'Please select a country!',
                }
            })
            validationSuccess = false;
        }

        // Validate idUpload
        if (!allowedFileTypes.includes(String(idUpload?.type))) {
            setErrors(current => {
                return {
                    ...current,
                    idUpload: 'Only formats jpg, jpeg, png and pdf are allowed!',
                }
            })
            validationSuccess = false;
        } else if (idUpload?.size) {
            if ((idUpload.size / 1024 / 1024) > allowedFileSize) {
                setErrors(current => {
                    return {
                        ...current,
                        idUpload: 'Your file is too large!',
                    }
                })
                validationSuccess = false;
            }
        }

        // Validate birthdate
        let birthdateInput = new Date(birthdate);
        let today = new Date();
        let difference = today.getMonth() - birthdateInput.getMonth() + (12 * (today.getFullYear() - birthdateInput.getFullYear()))
        if (new Date(birthdate) >= new Date() || difference < 18) {
            setErrors(current => {
                return {
                    ...current,
                    birthdate: 'You have to be 18 years old!',
                }
            })
            validationSuccess = false;
        }

        // Validate captcha
        if (!captchaIsValid) {
            setErrors(current => {
                return {
                    ...current,
                    captcha: 'Please solve the reCAPTCHA!',
                }
            })
            validationSuccess = false;
        }

        return validationSuccess;
    }

    const generateData = (): FormData => {
        const formData = new FormData()
        formData.append("name", `${firstname} ${lastname}`)
        formData.append('address', address)
        formData.append('city', city)
        formData.append('phoneNumber', `${phonePre}${phonenumber}`)
        formData.append('postcode', postcode)
        formData.append('country', country)
        formData.append('username', username)
        formData.append('email', email)
        formData.append('password', password)
        formData.append('dateOfBirth', birthdate)
        // @ts-ignore
        formData.append('idConfirmation', idUpload);

        return formData;
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateForm()) {
            axios.post('http://localhost:3002/login', generateData())
                .then(response => {
                    if (response.status === 200) {
                        setRegistrationSuccessfull(true);
                    }
                }).catch(err => {
                if (err.response.status === 405) {
                    if (err.response.data === 'Username already taken') {
                        setErrors({...errors, username: 'Username already taken...'});
                    } else if (err.response.data === 'Email already taken') {
                        setErrors({...errors, email: 'Email already taken...'});
                    } else if (err.response.data === 'Both already taken') {
                        // setErrors({...errors, username: 'Username already taken...'}); // Not working in FK
                        setErrors(current => {
                            return {
                                ...current,
                                username: 'Username already taken...',
                                email: 'Email already taken...'
                            }
                        })
                    }
                } else {
                    console.log('Unknown error...')
                }
                console.log(errors)
            });
        }
    };

    return (
        <div>
            {registrationSuccessfull &&
                <Navigate to={'/success'}/>
            }
            <Container>
                <Row className={'justify-content-center align-items-center mb-5'}>
                    <Col xs md lg={6}>
                        <div className={'display-4 text-center m-4'}>Sign up</div>
                        <Form onSubmit={handleSubmit} validated={false}>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formFirstname">
                                        <FloatingLabel
                                            controlId="floatingInputFirstname"
                                            label="Firstname *"
                                            className="mb-3"
                                        >
                                            <Form.Control type="text" placeholder="Your firstname"
                                                          onChange={(e) => setFirstname(e.target.value)}
                                                          value={firstname}
                                                          required
                                                          isInvalid={hasError('firstname')}/>
                                            <Form.Control.Feedback type={'invalid'}>
                                                {errors.formFirstname}
                                            </Form.Control.Feedback>
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formLastname">
                                        <FloatingLabel
                                            controlId="floatingInputLastname"
                                            label="Lastname *"
                                            className="mb-3"
                                        >
                                            <Form.Control type="text" placeholder="Your lastname"
                                                          onChange={(e) => setLastname(e.target.value)}
                                                          value={lastname}
                                                          required
                                                          isInvalid={hasError('lastname')}/>
                                            <Form.Control.Feedback type={'invalid'}>
                                                {errors.formLastname}
                                            </Form.Control.Feedback>
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formAddress">
                                        <FloatingLabel
                                            controlId="floatingInputAddress"
                                            label="Address *"
                                            className="mb-3"
                                        >
                                            <Form.Control type="text" placeholder="Your address"
                                                          onChange={(e) => setAddress(e.target.value)}
                                                          value={address}
                                                          required
                                                          isInvalid={hasError('address')}/>
                                            <Form.Control.Feedback type={'invalid'}>
                                                {errors.address}
                                            </Form.Control.Feedback>
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formPhone">
                                        <FloatingLabel
                                            controlId="floatingInputPhonenumber"
                                            label="Phonenumber *"
                                        >
                                            <Form.Control type="text" placeholder="Your phonenumber"
                                                          onChange={(e) => setPhonenumber(e.target.value)}
                                                          value={phonenumber}
                                                          required
                                                          isInvalid={hasError('phonenumber')}/>
                                            <Form.Control.Feedback type={'invalid'}>
                                                {errors.phonenumber}
                                            </Form.Control.Feedback>
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formPostcode">
                                        <FloatingLabel
                                            controlId="floatingInputPostcode"
                                            label="Postcode *"
                                            className="mb-3"
                                        >
                                            <Form.Control type="text" placeholder="Your postcode"
                                                          onChange={(e) => setPostcode(e.target.value)}
                                                          value={postcode}
                                                          required
                                                          isInvalid={hasError('postcode')}/>
                                            <Form.Control.Feedback type={'invalid'}>
                                                {errors.postcode}
                                            </Form.Control.Feedback>
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formCity">
                                        <FloatingLabel
                                            controlId="floatingInputCity"
                                            label="City *"
                                            className="mb-3"
                                        >
                                            <Form.Control type="text" placeholder="Your city"
                                                          onChange={(e) => setCity(e.target.value)}
                                                          value={city}
                                                          required
                                                          isInvalid={hasError('city')}/>
                                            <Form.Control.Feedback type={'invalid'}>
                                                {errors.city}
                                            </Form.Control.Feedback>
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formCountry">
                                        <Select options={countryOptions}
                                                placeholder={'Country *'}
                                                components={{Option: renderCountryOptions}}
                                                onChange={e => {
                                                    setCountryAndPhonePre(e);
                                                }}/>
                                        {hasError('country') &&
                                            <div style={styles.dangerFeedback}>
                                                {errors.country}
                                            </div>
                                        }
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formEmail">
                                        <FloatingLabel
                                            controlId="floatingInputEmail"
                                            label="Email *"
                                            className="mb-3"
                                        >
                                            <Form.Control type="email" placeholder="Your Email"
                                                          onChange={(e) => setEmail(e.target.value)}
                                                          value={email}
                                                          required
                                                          isInvalid={hasError('email')}/>
                                            <Form.Control.Feedback type={'invalid'}>
                                                {errors.email}
                                            </Form.Control.Feedback>
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formUsername">
                                        <FloatingLabel
                                            controlId="floatingInputUsername"
                                            label="Username *"
                                        >
                                            <Form.Control type="text" placeholder="Your username"
                                                          onChange={(e) => setUsername(e.target.value)}
                                                          onKeyUp={validateUsername}
                                                          value={username}
                                                          required
                                                          isInvalid={hasError('username')}/>
                                            <Form.Control.Feedback type={'invalid'}>
                                                {errors.username}
                                            </Form.Control.Feedback>
                                        </FloatingLabel>
                                        <Form.Text id="passwordHelpBlock" muted>
                                            <span
                                                className={usernameValidationResult ? 'text-success' : 'text-danger'}>
                                                {passwordValidationResult[0] ? <BsFillCheckCircleFill/> :
                                                    <BsFillXCircleFill/>} At least 5 characters
                                            </span>
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formPassword">
                                        <FloatingLabel
                                            controlId="floatingInputPassword"
                                            label="Password *"
                                        >
                                            <Form.Control type="password" placeholder="Your password"
                                                          onChange={(e) => setPassword(e.target.value)}
                                                          value={password}
                                                          required
                                                          onKeyUp={validatePassword}
                                                          isInvalid={hasError('password')}/>
                                            <Form.Control.Feedback type={'invalid'}>
                                                {errors.password}
                                            </Form.Control.Feedback>
                                        </FloatingLabel>
                                        <Form.Text id="passwordHelpBlock" muted>
                                            <span
                                                className={passwordValidationResult[0] ? 'text-success' : 'text-danger'}>
                                                {passwordValidationResult[0] ? <BsFillCheckCircleFill/> :
                                                    <BsFillXCircleFill/>} At least 8 characters
                                            </span>
                                            <br/>
                                            <span
                                                className={passwordValidationResult[1] ? 'text-success' : 'text-danger'}>
                                                {passwordValidationResult[1] ? <BsFillCheckCircleFill/> :
                                                    <BsFillXCircleFill/>} At least one special character
                                            </span>
                                            <br/>
                                            <span
                                                className={passwordValidationResult[2] ? 'text-success' : 'text-danger'}>
                                                {passwordValidationResult[2] ? <BsFillCheckCircleFill/> :
                                                    <BsFillXCircleFill/>} At least one number
                                            </span>
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formPasswordRepeat">
                                        <FloatingLabel
                                            controlId="floatingInputPasswordRepeat"
                                            label="Password Repeat *"
                                            className="mb-3"
                                        >
                                            <Form.Control type="password" placeholder="Your password"
                                                          onChange={(e) => setPasswordRepeat(e.target.value)}
                                                          value={passwordRepeat}
                                                          required
                                                          onKeyUp={validatePasswordRepeat}
                                                          isInvalid={hasError('passwordRepeat')}/>
                                            <Form.Control.Feedback type={'invalid'}>
                                                {errors.passwordRepeat}
                                            </Form.Control.Feedback>
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formBirthdate">
                                        <FloatingLabel
                                            controlId="floatingInputBirthdate"
                                            label="Birthdate *"
                                            className="mb-3"
                                        >
                                            <Form.Control type="date" placeholder="Your birthdate"
                                                          onChange={(e) => setBirthdate(e.target.value)}
                                                          value={birthdate}
                                                          required
                                                          isInvalid={hasError('birthdate')}/>
                                            <Form.Control.Feedback type={'invalid'}>
                                                {errors.birthdate}
                                            </Form.Control.Feedback>
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formIdUpload">
                                        <Form.Label>ID-Scan *</Form.Label>
                                        <Form.Control type="file" placeholder="Your id confirmation"
                                                      accept={"image/jpg, image/jpeg, image/png, application/pdf"}
                                                      onChange={(e) => setIdUpload((e.target as HTMLInputElement).files![0])}
                                                      required
                                                      isInvalid={hasError('idUpload')}/>
                                        <Form.Control.Feedback type={'invalid'}>
                                            {errors.idUpload}
                                        </Form.Control.Feedback>
                                        <Form.Text>
                                            Max-Size: 2MB <br/>
                                            Accepted-Formats: JPEG, JPG, PNG and PDF
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className={'mt-3 mb-3'}>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formTermsConditions">
                                        <Form.Check type="checkbox"
                                                    label="I have read and accepted all terms and conditions as written here."
                                                    onChange={(e) => setTermsConditions(e.target.checked)}
                                                    checked={termConditions}
                                                    required/>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className={'mt-1 mb-3'}>
                                <Col>
                                    <Form.Group>
                                        <ReCAPTCHA sitekey="6LcLHc8eAAAAAKbwcpinUX_bW_w9o7ui25A9rmoG"
                                                   onChange={onCaptchaChange}/>
                                        {!captchaIsValid &&
                                            <div style={styles.dangerFeedback}>
                                                {errors.captcha}
                                            </div>
                                        }
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
