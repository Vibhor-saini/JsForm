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

  if (selectedRows.length === 0) {
    window.alert('No rows selected for deletion.');
    return;
  }

  // Ask for confirmation before deleting
  const isConfirmed = window.confirm('Are you sure you want to delete the selected rows?');

  if (!isConfirmed) {
    return;
  }

  // Remove selected rows from the users array immediately after confirmation
  const indicesToDelete = Array.from(selectedRows).map((checkbox) => parseInt(checkbox.value));

  // Handle single-row deletion and multiple-row deletion
  const updatedUsers = users.filter((_user, index) => !indicesToDelete.includes(index));

  // Update localStorage
  localStorage.setItem('users', JSON.stringify(updatedUsers));

  // Reload the table
  loadUsers();

  // Display a success message after deletion
  window.alert('Selected rows successfully deleted.');
}

function selectedCheckboxes() {
  return document.querySelectorAll('input[type="checkbox"]:checked:not(#selectAll)');
}
