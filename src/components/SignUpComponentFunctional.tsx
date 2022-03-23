import React, {useState, useEffect, ReactElement} from 'react';
import {Container, Row, Col, Form, Button} from 'react-bootstrap';
import FloatingLabel from "react-bootstrap/FloatingLabel";
import {BsFillCheckCircleFill, BsFillXCircleFill} from "react-icons/bs";
import Select, {SingleValue} from "react-select";
// @ts-ignore
import ReCAPTCHA from 'react-google-recaptcha';
import {Navigate} from 'react-router-dom';
import axios from "axios";


/**
 * Interface for error-messages.
 */
interface IErrors {
    [key: string]: string;
}

/**
 * Interace for country-options in country-select-field.
 */
interface ICountry {
    label: string,
    value: string
    phonePre: string,
}

/**
 * Style-Object for error-messages that are not part of bootstrap.
 */
const styles = {
    dangerFeedback: {
        width: '100%',
        marginTop: '0.25rem',
        fontSize: '.875em',
        color: '#dc3545',
    },
}

/**
 * React Functional Component for SignUpPage.
 */
const SignUpComponentFunctional: React.FC = (): ReactElement => {

    // Constants
    const URL_REST_COUNTRIES: string = 'https://restcountries.com/v3.1/all';
    const URL_BACKEND: string = 'http://localhost:3002/login';
    const ALLOWED_FILE_TYPES: string[] = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    const ALLOWED_FILE_SIZE: number = 3; // in MegaBytes

    // Hoocks
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

    // Use-Effect.
    // Execute only one time.
    useEffect(() => {
        getCountryOptions();
    }, []);

    /**
     * Verify captcha-token with google-backend.
     * @param value captcha-token from google-captcha-plugin
     */
    const onCaptchaChange = (value: string): void => {
        // TODO Move to env-variables -> delete from repository.
        const secretKey = "6LcLHc8eAAAAAAdWx_rKchrtN5MC9rt5QbhGRRtd";
        const verificationUrl = 'http://localhost:8080/https://www.google.com/recaptcha/api/siteverify?secret=' + secretKey + '&response=' + value;
        axios.post(verificationUrl)
            .then(response => {
                console.log(response);
                setCaptchaIsValid(response.data.success);
            })
            .catch(err => {
                console.log(err);
                setCaptchaIsValid(false);
            });
    }

    /**
     * Get all countries from restcountries.com.
     * Create country<ICountry> Object for all countries
     * and add to the country-options hook.
     */
    const getCountryOptions = (): void => {
        let countryOptions: ICountry[] = [];

        axios.get(URL_REST_COUNTRIES)
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

    /**
     * Set selected country, phone-prefix and new phonenumber with prefix.
     * @param country selected country
     */
    const setCountryAndPhonePre = (country: SingleValue<ICountry>): void => {
        setCountry(country!.label);
        setPhonenumber(`${country!.phonePre} ${phonenumber.replace(phonePre, '').replace(' ', '')}`);
        setPhonePre(country!.phonePre);
    }

    /**
     * Render layout for a country-option in the country-select-field.
     * @param props properties from select-component
     */
    const renderCountryOptions = (props: any): ReactElement => {
        return (
            <div ref={props.innerProps} {...props.innerRef}>
                <img src={props.data.value} style={{width: 30}} alt=""/>
                <span className={'ms-2'}>{props.data.label}</span>
            </div>
        );
    };

    /**
     * Validate username.
     * Rules:
     *  - At least 5 characters
     */
    const validateUsername = (): void => {
        username.length < 5 ? setUsernameValidationResult(false) : setUsernameValidationResult(true);
    }

    /**
     * Validate password.
     * Rules:
     *  - At least 8 characters
     *  - At least one special character
     *  - At least one number
     */
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

    /**
     * Validate password-repeat.
     * Rules:
     *  - Has to be the same input as password
     */
    const validatePasswordRepeat = (): boolean => {
        if (password !== passwordRepeat) {
            setErrors(current => {
                return {
                    ...current,
                    passwordRepeat: 'Has to be the same password.',
                }
            });
            return false;
        }
        setErrors(current => {
            delete current.passwordRepeat;
            return {
                ...current
            }
        });
        return true;
    }

    /**
     * Check if given key is in error-object.
     * If key is found then an error for this field is present.
     * @param key key to find in object
     */
    const hasError = (key: string): boolean => {
        return errors[key]?.length > 0;
    }

    /**
     * Validate the whole form.
     * Some fields are validated through the required-tag in html.
     * Some fields are validated through a separate function.
     */
    const validateForm = (): boolean => {
        // Clean error-object
        setErrors({});
        let validationSuccess: boolean = true;

        // Validate username
        if (!usernameValidationResult) {
            setErrors(current => {
                return {
                    ...current,
                    username: 'You have to fulfill the requirements.',
                }
            });
            validationSuccess = false;
        }

        // Validate password
        if (!passwordValidationResult[0] || !passwordValidationResult[1] || !passwordValidationResult[2]) {
            setErrors(current => {
                return {
                    ...current,
                    password: 'You have to fulfill all requirements.',
                }
            });
            validationSuccess = false;
        }

        // Validate password-repeat
        if (!validatePasswordRepeat()) {
            validationSuccess = false;
        }

        // Validate country-selection
        if (!(country.length > 3)) {
            setErrors(current => {
                return {
                    ...current,
                    country: 'Please select a country!',
                }
            });
            validationSuccess = false;
        }

        // Validate idUpload -> Type and Size
        if (!ALLOWED_FILE_TYPES.includes(String(idUpload?.type))) {
            setErrors(current => {
                return {
                    ...current,
                    idUpload: 'Only formats jpg, jpeg, png and pdf are allowed!',
                }
            });
            validationSuccess = false;
        } else if (idUpload?.size) {
            if ((idUpload.size / 1024 / 1024) > ALLOWED_FILE_SIZE) {
                setErrors(current => {
                    return {
                        ...current,
                        idUpload: 'Your file is too large!',
                    }
                });
                validationSuccess = false;
            }
        }

        // Validate birthdate
        let birthdateInput = new Date(birthdate);
        let today = new Date();
        let difference = today.getMonth() - birthdateInput.getMonth() + (12 * (today.getFullYear() - birthdateInput.getFullYear()));
        if (new Date(birthdate) >= new Date() || difference < 18) {
            setErrors(current => {
                return {
                    ...current,
                    birthdate: 'You have to be 18 years old!',
                }
            });
            validationSuccess = false;
        }

        // Validate captcha
        if (!captchaIsValid) {
            setErrors(current => {
                return {
                    ...current,
                    captcha: 'Please solve the reCAPTCHA!',
                }
            });
            validationSuccess = false;
        }

        return validationSuccess;
    }

    /**
     * Generate the formData for axios.
     */
    const generateData = (): FormData => {
        const formData = new FormData();
        formData.append("name", `${firstname} ${lastname}`);
        formData.append('address', address);
        formData.append('city', city);
        formData.append('phoneNumber', `${phonePre}${phonenumber}`);
        formData.append('postcode', postcode);
        formData.append('country', country);
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('dateOfBirth', birthdate);
        // @ts-ignore
        formData.append('idConfirmation', idUpload);
        return formData;
    }

    /**
     * Handle form-submit.
     * Send data to backend after form-validation.
     * @param e submit-event
     */
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (validateForm()) {
            axios.post(URL_BACKEND, generateData())
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
                        setErrors(current => {
                            return {
                                ...current,
                                username: 'Username already taken...',
                                email: 'Email already taken...'
                            }
                        });
                    }
                } else {
                    console.log('Unknown error...')
                }
                console.log(errors)
            });
        }
    };

    /**
     * HTML-Code for this component.
     */
    return (
        <div>
            {/* Forward to success-page after registration-success. */}
            {registrationSuccessfull &&
                <Navigate to={'/success'}/>
            }
            <Container>
                <Row className={'justify-content-center align-items-center mb-5'}>
                    <Col xs md lg={6}>

                        {/* Title */}
                        <div className={'display-4 text-center m-4'}>Sign up</div>

                        {/* Form */}
                        <Form onSubmit={handleSubmit} validated={false}>
                            <Row>
                                {/* Firstname-Field */}
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

                                {/* Lastname-Field */}
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

                                {/* Address-Field */}
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

                                {/* Phonenumber-Field*/}
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

                                {/* Postcode-Field */}
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

                                {/* City-Field */}
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

                                {/* Country-Field */}
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

                                {/* E-Mail-Field */}
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

                                {/* Username-Field */}
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

                                {/* Password-Field */}
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

                                {/* Password-Repeat-Field */}
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

                                {/* Birthdate-Field */}
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

                                {/* Image-Upload-Field */}
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

                                {/* Terms-and-Conditions-Field */}
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

                                {/* Google-Captcha-Field */}
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

                            {/* Submit-Button */}
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

export default SignUpComponentFunctional;
