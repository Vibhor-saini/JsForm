const formFields = [
  { id: 'username', label: 'Username', validation: { required: true,  message: 'Username is required and should only contain letters' } },
  { id: 'email', label: 'Email', validation: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Valid email is required' } },
  { id: 'phone', label: 'Phone', validation: { required: true, pattern: /^[0-9]{10}$/, message: 'Phone number should be in 10 digits and required also' } },
  { id: 'gender', label: 'Gender', validation: { required: true, message: 'Please select a gender' } },
  { id: 'dob', label: 'Date of Birth', validation: { required: true, dobValidation: true, message: 'Valid Date of Birth is required' } },
  { id: 'course', label: 'Course', validation: { required: true, courseValidation: true, message: 'Please select at least one course' } },
  { id: 'startDate', label: 'Start Date', validation: { required: true, dateValidation: true, dobValidation: true, endDateValidation: true, message: 'Start Date should be less than End date and greater than DOB' } },
  { id: 'endDate', label: 'End Date', validation: { required: true, dateValidation: true, dobValidation: true, startDateValidation: true, message: 'End Date should be greater than Start date and greater than DOB' } },
  { id: 'address', label: 'Address', validation: { required: true, message: 'Address is required' } },
  { id: 'password', label: 'Password', validation: { required: true, message: 'Password is required and must be at least 6 characters' } },
  { id: 'confirmPassword', label: 'Confirm Password', validation: { required: true, confirmPasswordValidation: true, message: 'Passwords do not match' } },
  { id: 'confirmation', label: 'Terms and Conditions', validation: { required: true, message: 'You must agree to the terms and conditions' } },
];



//  this code ensures that the loadUsers function is executed once the html document is fully loaded and ready
document.addEventListener('DOMContentLoaded', function () {
  loadUsers();
});



// Validation on registration form----------------------------------------------------------------------------
function validateForm(form) {
  let isValid = true;

  clearErrorMessages(form);

  for (const field of formFields) {
    const element = form.elements[field.id];

    if (element) {
      const errorMessageElement = document.createElement('p');
      errorMessageElement.className = 'error-message';

      if (element.type !== 'radio' && element.type !== 'checkbox') {
        if (!element.checkValidity() && !(field.id === 'course' && element.selectedOptions.length > 0)) {
          isValid = false;
          errorMessageElement.textContent = `${field.label}: ${element.validationMessage || field.validation.message}`;
          element.parentNode.appendChild(errorMessageElement);
        }

      } else if (element.type === 'radio' && !form.querySelector(`[name="${field.id}"]:checked`)) {
        isValid = false;
        errorMessageElement.textContent = `${field.label}: ${field.validation.message}`;
        element.parentNode.appendChild(errorMessageElement);

      } else if (element.type === 'checkbox' && !element.checked) {
        isValid = false;
        errorMessageElement.textContent = `${field.label}: ${field.validation.message}`;
        element.parentNode.appendChild(errorMessageElement);

      } else if (field.id === 'confirmation' && element.type === 'checkbox' && !element.checked) {
        isValid = false;
        errorMessageElement.textContent = `${field.label}: ${field.validation.message}`;
        element.parentNode.appendChild(errorMessageElement);
      }

      if (field.validation.required && !element.value.trim()) {
        isValid = false;
        errorMessageElement.textContent = `${field.label}: ${field.validation.message}`;
        element.parentNode.appendChild(errorMessageElement);
      }

      if (field.id === 'username' && !/^[a-zA-Z]+(?: [a-zA-Z]+)?$/.test(element.value.trim())) {
        isValid = false;
        errorMessageElement.textContent = `${field.label}: ${field.validation.message}`;
        element.parentNode.appendChild(errorMessageElement);
      }
      

      if (field.id === 'phone' && !/^[0-9]{10}$/.test(element.value.trim())) {
        isValid = false;
        errorMessageElement.textContent = `${field.label}: ${field.validation.message}`;
        element.parentNode.appendChild(errorMessageElement);
      }

        // Adding date validation for start and end date fields
        if (field.id === 'startDate') {
          const endDateElement = form.elements['endDate'];
          const dobElement = form.elements['dob'];
  
          if (endDateElement.value && new Date(element.value) >= new Date(endDateElement.value)) {
            isValid = false;
            errorMessageElement.textContent = ` Course Start Date must be less than course End Date`;
            element.parentNode.appendChild(errorMessageElement);
          }
  
          if (dobElement.value && new Date(element.value) <= new Date(dobElement.value)) {
            isValid = false;
            errorMessageElement.textContent = `Course Start Date must be greater than Date of Birth`;
            element.parentNode.appendChild(errorMessageElement);
          }
        }
  
        if (field.id === 'endDate') {
          const startDateElement = form.elements['startDate'];
          const dobElement = form.elements['dob'];
  
          if (startDateElement.value && new Date(element.value) <= new Date(startDateElement.value)) {
            isValid = false;
            errorMessageElement.textContent = ` Course End Date must be greater than course Start Date`;
            element.parentNode.appendChild(errorMessageElement);
          }
  
          if (dobElement.value && new Date(element.value) <= new Date(dobElement.value)) {
            isValid = false;
            errorMessageElement.textContent = `Course End Date must be greater than Date of Birth`;
            element.parentNode.appendChild(errorMessageElement);
          }
        }

        if (field.id === 'dob') {
          const startDateElement = form.elements['startDate'];
          const endDateElement = form.elements['endDate'];
  
          if (startDateElement.value && new Date(element.value) >= new Date(startDateElement.value)) {
            isValid = false;
            errorMessageElement.textContent = `Date of Birth must be less than course Start Date`;
            element.parentNode.appendChild(errorMessageElement);
          }
  
          if (endDateElement.value && new Date(element.value) >= new Date(endDateElement.value)) {
            isValid = false;
            errorMessageElement.textContent = `Date of Birth must be less than course End Date`;
            element.parentNode.appendChild(errorMessageElement);
          }
        }

      if (field.id === 'confirmPassword' && element.value !== form.elements.password.value) {
        isValid = false;
        errorMessageElement.textContent = `${field.label}: ${field.validation.message}`;
        element.parentNode.appendChild(errorMessageElement);
      }
    }
  }
 
  return isValid;
}










// functionality for check email and phone is dublicate or not at entry time-----------------------------------

function displayErrorMessage(message, fieldId, errorMessages) {
  const errorMessageElement = document.createElement('p');
  errorMessageElement.className = 'error-message';
  errorMessageElement.textContent = message;
  errorMessageElement.id = `${fieldId}Error`; // Set a unique id for the error message

  const fieldElement = document.getElementById(fieldId);
  if (fieldElement) {
      fieldElement.parentNode.appendChild(errorMessageElement);
  } else {
      errorMessages.appendChild(errorMessageElement);
  }
}



function getFormData(form) {
  const formData = {};
  for (const field of formFields) {
    const element = form.elements[field.id];

    if (element) {
      if (element.type === 'select-multiple') {
        // For multiple select (e.g., courses)
        formData[field.id] = Array.from(element.selectedOptions).map(option => option.value);
      } else if (element.type !== 'radio' || element.checked) {
        // For other fields
        formData[field.id] = element.value;
      }
    }
  }
  return formData;
}

function register() {
  const form = document.getElementById('registrationForm');
  const errorMessages = document.getElementById('errorMessages');

  // Clear previous error messages
  errorMessages.innerHTML = '';
  clearErrorMessages(form);

  const isValid = validateForm(form, errorMessages);

  // Check for email and phone duplicates
  const userData = getFormData(form);
  const emailDuplicate = isEmailDuplicate(userData.email);
  const phoneDuplicate = isPhoneDuplicate(userData.phone);

  if (emailDuplicate || phoneDuplicate || !isValid) {
      if (emailDuplicate) {
          displayErrorMessage('Email already exists. Please use a different Email.', 'email', errorMessages);
      }

      if (phoneDuplicate) {
          displayErrorMessage('Phone already exists. Please use a different Phone.', 'phone', errorMessages);
      }
      return;
  }

  saveUserData(userData);
  loadUsers();

  // Reset the form fields
  form.reset();

  window.alert('User successfully registered.');
}








// Dublicate email and phone checking (for edit form)----------------------------------------------------------------

function isEmailDuplicate(newEmail, currentIndex) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  return users.some((user, index) => index !== currentIndex && user.email === newEmail);
}

function isPhoneDuplicate(newPhone, currentIndex) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  return users.some((user, index) => index !== currentIndex && user.phone === newPhone);
}

function clearErrorMessages(form) {
  const errorElements = form.querySelectorAll('.error-message');

  errorElements.forEach((errorElement) => {
    errorElement.parentNode.removeChild(errorElement);
  });
}
// if there is dublicate error then it will show----------------------------------------

function DisplayDuplicateError(form, fieldId, currentIndex) {
const errorMessages = form.querySelector('#errorMessages');
const fieldError = form.querySelector(`#${fieldId}Error`);

clearErrorMessagesForField(form, fieldId);

// Check for duplicates only if the field is being edited
if (currentIndex !== undefined) {
const userData = getFormData(form);
const isDuplicate = fieldId === 'email' ? isEmailDuplicate(userData.email, currentIndex) : isPhoneDuplicate(userData.phone, currentIndex);

if (isDuplicate) {
  const errorMessageElement = document.createElement('p');
  errorMessageElement.className = 'error-message';
  errorMessageElement.textContent = `${fieldId} already exist: Please use a different ${fieldId}.`;
  errorMessageElement.id = `${fieldId}Error`;

  if (fieldError) {
    // If there's already an error container, just append the new message
    fieldError.appendChild(errorMessageElement);
  } else {
    // If there's no error container, create one and append the message
    const fieldElement = form.querySelector(`#${fieldId}`);
    if (fieldElement) {
      const errorContainer = document.createElement('div');
      errorContainer.appendChild(errorMessageElement);
      fieldElement.parentNode.appendChild(errorContainer);
    } else {
      errorMessages.appendChild(errorMessageElement);
    }
  }
}
}
}


function clearErrorMessagesForField(form, fieldId) {
  const fieldError = form.querySelector(`${fieldId}Error`);
  if (fieldError) {
    fieldError.parentNode.removeChild(fieldError);
  }
}

function saveUserData(userData) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  users.push(userData);
  localStorage.setItem('users', JSON.stringify(users));
}












// load user in the table-------------------------------------------------------------------------------------------

function loadUsers() {
  const userTableBody = document.getElementById('userTableBody');
  userTableBody.innerHTML = ''; // Clear the existing table content

  const users = JSON.parse(localStorage.getItem('users')) || [];

  users.forEach((user, index) => {
    const row = userTableBody.insertRow();
    const cell0 = row.insertCell(0);
    const cell1 = row.insertCell(1);
    const cell2 = row.insertCell(2);
    const cell3 = row.insertCell(3);

    // Add a checkbox for each row
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = index;
    checkbox.onclick = function () {
      toggleCheckbox(this);
    };
    cell0.appendChild(checkbox);

    cell1.textContent = index + 1;
    cell2.textContent = user.username;

    cell1.addEventListener('click', function () {
      openModal(user);
    });

    cell2.addEventListener('click', function () {
      openModal(user);
    });

    // The "Action" cell with buttons
    const actionCell = document.createElement('div');
    const editButton = document.createElement('button');
    const deleteButton = document.createElement('button');

    editButton.textContent = 'Edit';
    editButton.addEventListener('click', function () {
      openEditModal(user, index);
    });

    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function () {
      deleteUser(index);
    });

    actionCell.appendChild(editButton);
    actionCell.appendChild(deleteButton);
    cell3.appendChild(actionCell);
  });
}



// Open modal functionality------------------------------------------------------------------------------------------------

  function openEditModal(user, index) {
  const modal = document.getElementById('userModal');
  const modalContent = document.getElementById('modalContent');
  modal.style.display = 'block';

  // Create a form for editing user details
  const editForm = document.createElement('form');
  editForm.id = 'editForm';

  editForm.style.position = 'relative';
  editForm.style.padding = '20px';

  formFields.forEach((field) => {
    // Skip excluded fields
    if (['password', 'confirmPassword', 'confirmation'].includes(field.id)) {
      return;
    }

    const fieldContainer = document.createElement('div');

    const label = document.createElement('label');
    label.textContent = field.label;

    const input = createFieldInput(field, user);

    if (input) {
      const errorContainer = document.createElement('div');
      errorContainer.id = `${field.id}Error`;

      // Append the label, input, and error container to the field container
      fieldContainer.appendChild(label);
      fieldContainer.appendChild(input);
      fieldContainer.appendChild(errorContainer);

      // Append the field container to the form
      editForm.appendChild(fieldContainer);
    }
  });

  // Add an "Update" button to the form
  const updateButton = document.createElement('button');
  updateButton.type = 'button';
  updateButton.textContent = 'Update';
  updateButton.addEventListener('click', function () {
    updateUserData(index);
  });

  editForm.appendChild(updateButton);

  modalContent.innerHTML = '';
  modalContent.appendChild(editForm);

 // Add the close button at the top-right corner
 const closeButton = document.createElement('button');
 closeButton.textContent = 'Close';
 closeButton.style.position = 'absolute';
 closeButton.style.top = '10px';
 closeButton.style.right = '10px';
 closeButton.style.backgroundColor = 'black';

 
  closeButton.addEventListener('click', function () {
    closeModal();
  });
  modalContent.appendChild(closeButton);
}

function createFieldInput(field, user) {
  const input = document.createElement('input');
  input.type = 'text';
  input.id = field.id;
  input.name = field.id;
  input.value = user[field.id];

  // Add validation attributes to the input
  if (field.validation.required) {
    input.required = true;
  }
  if (field.validation.pattern) {
    input.pattern = field.validation.pattern.source;
  }

  

  if (field.id === 'gender') {
    // For the gender field, create a select element
    const select = document.createElement('select');
    select.id = 'gender';
    select.name = 'gender';

    // Define gender options
    const genderOptions = ['male', 'female'];

    // Create option elements and select the correct one based on user's data
    genderOptions.forEach((option) => {
      const optionElement = document.createElement('option');
      optionElement.value = option;
      optionElement.textContent = option;
      if (user.gender === option) {
        optionElement.selected = true;
      }
      select.appendChild(optionElement);
    });

    return select;
  }

  if (field.id === 'dob') {
    // For the date of birth field, create an input with type 'date'
    input.type = 'date';
  }

  if (field.id === 'course') {
    // For the course field, create a select element
    const select = document.createElement('select');
    select.id = 'course';
    select.name = 'course';
    select.multiple = true; // Allow multiple selections
  
    // Dynamically fetch course options from local storage
    const courseOptions = ['btech', 'bca', 'bcom', 'mtech', 'bsc'];
    courseOptions.forEach((option) => {
      const optionElement = document.createElement('option');
      // optionElement.value = option.toLowerCase();
      optionElement.textContent = option;
  
      // Check if the course is selected for the user
      if (user.course && user.course.includes(optionElement.value)) {
        optionElement.selected = true;
      }
  
      select.appendChild(optionElement);
    });
  
    return select;
  }
  

  // Exclude Password, Confirm Password, and Terms and Conditions
  if (['password', 'confirmPassword', 'confirmation'].includes(field.id)) {
    return null;
  }

  // For other fields, return the regular input element
  return input;
}













// Update functionality--------------------------------------------------------------------------------------------

function updateUserData(index) {
  const editForm = document.getElementById('editForm');
  const errorMessages = document.getElementById('errorMessages');

  // Clear previous error messages
  errorMessages.innerHTML = '';
  clearErrorMessages(editForm);

  // Validate the edit form
  const isValid = validateForm(editForm, errorMessages);

  if (!isValid) {
    return;
  }

  // Get updated user data from the edit form
  const updatedUserData = getFormData(editForm);

  // Check for email and phone duplicates in the edit form
  DisplayDuplicateError(editForm, 'email', index);
  DisplayDuplicateError(editForm, 'phone', index);

  // If there are duplicates in the edit form, display an error and return
  if (editForm.querySelector('.error-message')) {
    return;
  }

  // Update user in localStorage
  const users = JSON.parse(localStorage.getItem('users')) || [];
  users[index] = updatedUserData;
  localStorage.setItem('users', JSON.stringify(users));

  // Close the modal and reload users
  closeModal();
  loadUsers();

  window.alert('User successfully updated.');
}

  









// Open modal functionality--------------------------------------------------------------------------------

function openModal(user) {
  const modal = document.getElementById('userModal');
  const modalContent = document.getElementById('modalContent');
  modal.style.display = 'block';

  modalContent.innerHTML = '';

  for (const key in user) {
    // Skip pass , confirmpass , confirmation  fields

    if (['password', 'confirmPassword', 'confirmation'].includes(key)) {
      continue;
    }

    const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
    const row = document.createElement('p');
    row.innerHTML = `<strong>${formattedKey}:</strong> ${Array.isArray(user[key]) ? user[key].join(', ') : user[key]}`;
    modalContent.appendChild(row);
  }

  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';

  closeButton.addEventListener('click', function () {
    closeModal();
  });
  modalContent.appendChild(closeButton);
}

function closeModal() {
  const modal = document.getElementById('userModal');
  modal.style.display = '';
}












// Delete functionality------------------------------------------------------------------------------------------

// functionality for delete button in table-------

function deleteUser(index) {
  const users = JSON.parse(localStorage.getItem('users')) || [];

  const isConfirmed = window.confirm('Are you sure you want to delete this user?');

  if (!isConfirmed) {
    return;
  }

  users.splice(index, 1);
  localStorage.setItem('users', JSON.stringify(users));
  loadUsers();
}


// functionality  for delete with checkboxes--------

//event listener for each checkbox
const checkboxes = document.querySelectorAll('input[type="checkbox"]:not(#confirmation)');
checkboxes.forEach(checkbox => {
  checkbox.addEventListener('click', function () {
    toggleCheckbox(this);
  });
});

// Event listener for the select all checkbox
const selectAllCheckbox = document.getElementById('selectAll');
selectAllCheckbox.addEventListener('click', function () {
  toggleCheckbox(this);
});

function toggleCheckbox(checkbox) {
  if (checkbox.id === 'selectAll') {
    toggleAllCheckboxes(checkbox);
  } else {
    updateDeleteButtonState(); // Update the state of the "Delete Selected" button
  }
}

function toggleAllCheckboxes(selectAllCheckbox) {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]:not(#confirmation)');

 
  
  checkboxes.forEach((checkbox) => {
    checkbox.checked = selectAllCheckbox.checked;
  });

  // Update the state of the checkboxes in the table header only if the user explicitly clicked on "Select All"
  if (selectAllCheckbox.checked) {
    updateDeleteButtonState();
  }
}

function updateDeleteButtonState() {
  const selectedRows = selectedCheckboxes();
  const deleteButton = document.getElementById('deleteButton');
  deleteButton.disabled = selectedRows.length === 0;
}

function deleteSelectedRows() {
  const selectedRows = selectedCheckboxes();
  const users = JSON.parse(localStorage.getItem('users')) || [];

 
  // Ask for confirmation before deleting
  const isConfirmed = window.confirm('Are you sure you want to delete the selected rows?');

  if (!isConfirmed) {
    return;
  }

  const indicesToDelete = Array.from(selectedRows).map((checkbox) => parseInt(checkbox.value));

  // Handle single-row deletion and multiple-row deletion
  const updatedUsers = users.filter((_user, index) => !indicesToDelete.includes(index));

  localStorage.setItem('users', JSON.stringify(updatedUsers));

  loadUsers();
  window.alert('Selected rows successfully deleted.');
}



 function selectedCheckboxes() {
    return document.querySelectorAll('input[type="checkbox"]:checked:not(#selectAll)');
  }









