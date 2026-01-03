// Validation utility functions

// Validate phone number (should be 10 digits)
export const validatePhone = (phone) => {
    if (!phone) {
        return { isValid: false, error: 'Phone number is required' };
    }
    
    const phoneStr = phone.toString().trim();
    const phoneRegex = /^[0-9]{10}$/;
    
    if (!phoneRegex.test(phoneStr)) {
        return { isValid: false, error: 'Phone number must be exactly 10 digits' };
    }
    
    return { isValid: true };
};

// Validate email
export const validateEmail = (email) => {
    if (!email) {
        return { isValid: false, error: 'Email is required' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email.trim())) {
        return { isValid: false, error: 'Please enter a valid email address' };
    }
    
    return { isValid: true };
};

// Validate password (minimum 8 characters, at least one number and one symbol)
export const validatePassword = (password) => {
    if (!password) {
        return { isValid: false, error: 'Password is required' };
    }
    
    if (password.length < 8) {
        return { isValid: false, error: 'Password must be at least 8 characters long' };
    }
    
    if (password.length > 128) {
        return { isValid: false, error: 'Password is too long (maximum 128 characters)' };
    }
    
    // Check for at least one number
    if (!/[0-9]/.test(password)) {
        return { isValid: false, error: 'Password must contain at least one number' };
    }
    
    // Check for at least one symbol (special character)
    // Symbols: !@#$%^&*()_+-=[]{}|;:,.<>?
    if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
        return { isValid: false, error: 'Password must contain at least one symbol (!@#$%^&* etc.)' };
    }
    
    return { isValid: true };
};

// Validate name (firstName, lastName, clinicName)
export const validateName = (name, fieldName = 'Name') => {
    if (!name) {
        return { isValid: false, error: `${fieldName} is required` };
    }
    
    const nameStr = name.trim();
    
    if (nameStr.length < 2) {
        return { isValid: false, error: `${fieldName} must be at least 2 characters long` };
    }
    
    if (nameStr.length > 50) {
        return { isValid: false, error: `${fieldName} is too long (maximum 50 characters)` };
    }
    
    // Allow letters, spaces, hyphens, and apostrophes
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    
    if (!nameRegex.test(nameStr)) {
        return { isValid: false, error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` };
    }
    
    return { isValid: true };
};

// Validate address
export const validateAddress = (address) => {
    if (!address) {
        return { isValid: false, error: 'Address is required' };
    }
    
    const addressStr = address.trim();
    
    if (addressStr.length < 5) {
        return { isValid: false, error: 'Address must be at least 5 characters long' };
    }
    
    if (addressStr.length > 200) {
        return { isValid: false, error: 'Address is too long (maximum 200 characters)' };
    }
    
    return { isValid: true };
};

// Validate login form
export const validateLogin = (form) => {
    const errors = {};
    
    const phoneValidation = validatePhone(form.phone);
    if (!phoneValidation.isValid) {
        errors.phone = phoneValidation.error;
    }
    
    const passwordValidation = validatePassword(form.password);
    if (!passwordValidation.isValid) {
        errors.password = passwordValidation.error;
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// Validate user signup form
export const validateUserSignup = (form) => {
    const errors = {};
    
    const firstNameValidation = validateName(form.firstName, 'First name');
    if (!firstNameValidation.isValid) {
        errors.firstName = firstNameValidation.error;
    }
    
    const lastNameValidation = validateName(form.lastName, 'Last name');
    if (!lastNameValidation.isValid) {
        errors.lastName = lastNameValidation.error;
    }
    
    const phoneValidation = validatePhone(form.phone);
    if (!phoneValidation.isValid) {
        errors.phone = phoneValidation.error;
    }
    
    const passwordValidation = validatePassword(form.password);
    if (!passwordValidation.isValid) {
        errors.password = passwordValidation.error;
    }
    
    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!form.termsConsent) {
        errors.termsConsent = 'You must agree to the terms and conditions';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// Validate clinic signup form
export const validateClinicSignup = (form) => {
    const errors = {};
    
    const clinicNameValidation = validateName(form.clinicName, 'Clinic name');
    if (!clinicNameValidation.isValid) {
        errors.clinicName = clinicNameValidation.error;
    }
    
    const emailValidation = validateEmail(form.email);
    if (!emailValidation.isValid) {
        errors.email = emailValidation.error;
    }
    
    const phoneValidation = validatePhone(form.phone);
    if (!phoneValidation.isValid) {
        errors.phone = phoneValidation.error;
    }
    
    const addressValidation = validateAddress(form.address);
    if (!addressValidation.isValid) {
        errors.address = addressValidation.error;
    }
    
    const passwordValidation = validatePassword(form.password);
    if (!passwordValidation.isValid) {
        errors.password = passwordValidation.error;
    }
    
    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!form.termsConsent) {
        errors.termsConsent = 'You must agree to the terms and conditions';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

