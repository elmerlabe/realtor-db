import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  addNewAgent,
  emailCheck,
  getAgentFromId,
  getStates,
  removeAgent,
  updateAgentInfo,
} from '../api';
import Layout from './Layout';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const NewRecord = () => {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const [currentEmail, setCurrentEmail] = useState('');
  const [states, setStates] = useState([]);
  const errorMsg = '* Please enter a valid phone number';
  const [emailChck, setEmailChck] = useState({ valid: true, message: '' });
  const [officePhoneChck, setOfficePhoneChck] = useState({
    valid: true,
    message: '',
  });
  const [officeFaxChck, setOfficeFaxChck] = useState({
    valid: true,
    message: '',
  });
  const [cellPhoneChck, setCellPhoneChck] = useState({
    valid: true,
    message: '',
  });

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    officeName: '',
    officeAddress1: '',
    officeAddress2: '',
    officeCity: '',
    officeState: '',
    officeZip: '',
    officeCountry: '',
    officePhone: '',
    officeFax: '',
    cellPhone: '',
  });

  useEffect(() => {
    getStates().then((res) => {
      setStates(res.data.states);
    });

    if (agentId) {
      getAgentFromId(agentId).then((res) => {
        const d = res.data.data[0];
        setCurrentEmail(d['email']);
        setFormData({
          email: d['email'],
          firstName: d['firstName'],
          middleName: d['middleName'],
          lastName: d['lastName'],
          suffix: d['suffix'],
          officeName: d['officeName'],
          officeAddress1: d['officeAddress1'],
          officeAddress2: d['officeAddress2'],
          officeCity: d['officeCity'],
          officeState: d['officeState'],
          officeZip: d['officeZip'],
          officeCountry: d['officeCountry'],
          officePhone: d['officePhone'],
          officeFax: d['officeFax'],
          cellPhone: d['cellPhone'],
        });
        document.getElementById('officePhone').value = d['officePhone'];
        document.getElementById('officeFax').value = d['officeFax'];
        document.getElementById('cellPhone').value = d['cellPhone'];
      });
    }
  }, []);

  const handleSubmitForm = (e) => {
    e.preventDefault();
    displayError();
    if (
      !emailChck.valid ||
      !officePhoneChck.valid ||
      !officeFaxChck.valid ||
      !cellPhoneChck.valid
    )
      return false;

    if (agentId) {
      updateAgentInfo(agentId, formData).then((res) => {
        Swal.fire('Success', res.data.message, 'success');
        setCurrentEmail(formData.email);
      });
    } else {
      addNewAgent(formData).then((res) => {
        if (res.data.result) {
          Swal.fire('Success', res.data.message, 'success');
        } else {
          Swal.fire('Error', res.data.message, 'error');
        }
      });
    }
  };

  const handleRemove = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        removeAgent(agentId)
          .then((res) => {
            //Swal.fire("Deleted!", "Agent record has been deleted.", "success");
            window.location.href = '/agents';
          })
          .catch((res) => {
            console.log(res);
          });
      }
    });
  };

  const handleBack = () => {
    if (window.history.length > 2) {
      window.history.back();
    } else {
      navigate('/agents');
    }
  };

  function checkPhoneNumber(number) {
    //var reg = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/; // 111-111-1111, 1111111111, (111) 111-1111
    var reg = /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/; // 111-111-1111, (111) 111-1111
    if (number.match(reg)) {
      return true;
    } else {
      return false;
    }
  }

  function addHypen(e) {
    const id = e.target.id;
    const key = Number(e.key);
    const input = document.getElementById(id);

    if (isNaN(key)) return;

    if (
      e.key !== 'Backspace' &&
      (input.value.length === 3 || input.value.length === 7)
    ) {
      input.value += '-';
    }
  }

  function displayError() {
    if (!emailChck.valid)
      setEmailChck({
        ...emailChck,
        valid: false,
      });

    if (!officePhoneChck.valid)
      setOfficePhoneChck({
        ...officePhoneChck,
        valid: false,
        message: errorMsg,
      });

    if (!officeFaxChck.valid)
      setOfficeFaxChck({
        ...officeFaxChck,
        valid: false,
        message: errorMsg,
      });

    if (!cellPhoneChck.valid)
      setCellPhoneChck({
        ...cellPhoneChck,
        valid: false,
        message: errorMsg,
      });
  }

  function validateNumber(e) {
    const id = e.target.id;
    const val = e.target.value;

    if (id === 'cellPhone') {
      if (checkPhoneNumber(val)) {
        setCellPhoneChck({
          ...formData,
          valid: true,
          message: '',
        });
        setFormData({ ...formData, cellPhone: val });
      } else {
        setCellPhoneChck({
          ...formData,
          valid: false,
          message: errorMsg,
        });
      }
    } else if (id === 'officeFax') {
      if (checkPhoneNumber(val)) {
        setOfficeFaxChck({
          ...formData,
          valid: true,
          message: '',
        });
        setFormData({ ...formData, officeFax: val });
      } else {
        setOfficeFaxChck({
          ...formData,
          valid: false,
          message: errorMsg,
        });
      }
    } else if (id === 'officePhone') {
      if (checkPhoneNumber(val)) {
        setOfficePhoneChck({
          ...formData,
          valid: true,
          message: '',
        });
        setFormData({ ...formData, officePhone: val });
      } else {
        setOfficePhoneChck({
          ...formData,
          valid: false,
          message: errorMsg,
        });
      }
    }
  }

  function validateEmail(email) {
    if (email !== '' && currentEmail !== email) {
      emailCheck(email).then((res) => {
        if (res.data.result) {
          setEmailChck({ ...emailChck, valid: true, message: '' });
        } else {
          setEmailChck({
            ...emailChck,
            valid: false,
            message: '* ' + res.data.message,
          });
        }
      });
    } else {
      setEmailChck({ ...emailChck, valid: true, message: '' });
    }
  }

  return (
    <Layout>
      <div>
        <div className="px-4 sm:px-6 lg:px-8">
          <div
            onClick={handleBack}
            className="flex items-center cursor-pointer hover:text-blue-500 font-semibold text-xl mb-3"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2 mt-1" />
            <span>Back</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            {agentId !== undefined ? 'Update Record' : 'Add New Record'}
          </h1>
          <form onSubmit={handleSubmitForm}>
            <div className="mt-4 grid md:grid-cols-2 md:gap-x-10 gap-y-2 bg-white p-4 md:p-10 xs:-1 shadow rounded-md">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onBlur={(e) => validateEmail(e.target.value)}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={
                      (emailChck.message === ''
                        ? 'border-gray-300'
                        : 'border-red-300') +
                      ' block w-full text-sm px-3 py-2 rounded-md border shadow-sm outline-indigo-800 focus:border-indigo-500 focus:ring-indigo-500'
                    }
                  />
                  {emailChck.valid ? null : (
                    <small className="text-sm text-red-500">
                      {emailChck.message}
                    </small>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <div>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onFocus={displayError}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="block w-full text-sm px-3 py-2 rounded-md border border-gray-300 shadow-sm outline-indigo-800 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="middleName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Middle Name
                </label>
                <div>
                  <input
                    type="text"
                    id="middleName"
                    value={formData.middleName}
                    onChange={(e) =>
                      setFormData({ ...formData, middleName: e.target.value })
                    }
                    className="block w-full text-sm px-3 py-2 rounded-md border border-gray-300 shadow-sm outline-indigo-800 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <div>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="block w-full text-sm px-3 py-2 rounded-md border border-gray-300 shadow-sm outline-indigo-800 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="suffix"
                  className="block text-sm font-medium text-gray-700"
                >
                  Suffix
                </label>
                <div>
                  <input
                    type="text"
                    id="suffix"
                    value={formData.suffix}
                    onChange={(e) =>
                      setFormData({ ...formData, suffix: e.target.value })
                    }
                    className="block w-full text-sm px-3 py-2 rounded-md border border-gray-300 shadow-sm outline-indigo-800 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="officeName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Office Name
                </label>
                <div>
                  <input
                    type="text"
                    id="officeName"
                    value={formData.officeName}
                    onChange={(e) =>
                      setFormData({ ...formData, officeName: e.target.value })
                    }
                    className="block w-full text-sm px-3 py-2 rounded-md border border-gray-300 shadow-sm outline-indigo-800 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="officeAddress1"
                  className="block text-sm font-medium text-gray-700"
                >
                  Office Address 1
                </label>
                <div>
                  <input
                    type="text"
                    id="officeAddress1"
                    value={formData.officeAddress1}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        officeAddress1: e.target.value,
                      })
                    }
                    className="block w-full text-sm px-3 py-2 rounded-md border border-gray-300 shadow-sm outline-indigo-800 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="officeAddress2"
                  className="block text-sm font-medium text-gray-700"
                >
                  Office Address 2
                </label>
                <div>
                  <input
                    type="text"
                    id="officeAddress2"
                    value={formData.officeAddress2}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        officeAddress2: e.target.value,
                      })
                    }
                    className="block w-full text-sm px-3 py-2 rounded-md border border-gray-300 shadow-sm outline-indigo-800 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="officeCity"
                  className="block text-sm font-medium text-gray-700"
                >
                  Office City
                </label>
                <div>
                  <input
                    type="text"
                    id="officeCity"
                    value={formData.officeCity}
                    onChange={(e) =>
                      setFormData({ ...formData, officeCity: e.target.value })
                    }
                    className="block w-full text-sm px-3 py-2 rounded-md border border-gray-300 shadow-sm outline-indigo-800 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="officeState"
                  className="block text-sm font-medium text-gray-700"
                >
                  Office State
                </label>
                <div>
                  <select
                    id="officeState"
                    value={formData.officeState}
                    onChange={(e) =>
                      setFormData({ ...formData, officeState: e.target.value })
                    }
                    className="block w-full text-sm px-3 py-2 rounded-md border border-gray-300 shadow-sm outline-indigo-800 focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    {states.map((s, i) => (
                      <option key={i} value={s.name}>
                        {s.longName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="officeZip"
                  className="block text-sm font-medium text-gray-700"
                >
                  Office Zip
                </label>
                <div>
                  <input
                    type="text"
                    id="officeZip"
                    value={formData.officeZip}
                    onChange={(e) =>
                      setFormData({ ...formData, officeZip: e.target.value })
                    }
                    className="block w-full text-sm px-3 py-2 rounded-md border border-gray-300 shadow-sm outline-indigo-800 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="officeCountry"
                  className="block text-sm font-medium text-gray-700"
                >
                  Office Country
                </label>
                <div>
                  <input
                    type="text"
                    id="officeCountry"
                    value={formData.officeCountry}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        officeCountry: e.target.value,
                      })
                    }
                    className="block w-full text-sm px-3 py-2 rounded-md border border-gray-300 shadow-sm outline-indigo-800 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="officePhone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Office Phone
                </label>
                <div>
                  <input
                    type="text"
                    id="officePhone"
                    maxLength={12}
                    onBlur={(e) => validateNumber(e)}
                    onKeyDown={(e) => addHypen(e)}
                    className={
                      (officePhoneChck.message === ''
                        ? 'border-gray-300'
                        : 'border-red-300') +
                      ' block w-full text-sm px-3 py-2 rounded-md border shadow-sm outline-indigo-800 focus:border-indigo-500 focus:ring-indigo-500'
                    }
                  />
                  {officePhoneChck.valid ? null : (
                    <small className="text-sm text-red-500">
                      {officePhoneChck.message}
                    </small>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="officeFax"
                  className="block text-sm font-medium text-gray-700"
                >
                  Office Fax
                </label>
                <div>
                  <input
                    type="text"
                    id="officeFax"
                    maxLength={12}
                    onBlur={(e) => validateNumber(e)}
                    onKeyDown={(e) => addHypen(e)}
                    className={
                      (officeFaxChck.message === ''
                        ? 'border-gray-300'
                        : 'border-red-300') +
                      ' block w-full text-sm px-3 py-2 rounded-md border shadow-sm outline-indigo-800 focus:border-indigo-500 focus:ring-indigo-500'
                    }
                  />
                  {officeFaxChck.valid ? null : (
                    <small className="text-sm text-red-500">
                      {officeFaxChck.message}
                    </small>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="cellPhone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Cell Phone
                </label>
                <div>
                  <input
                    type="text"
                    id="cellPhone"
                    maxLength={12}
                    onBlur={(e) => validateNumber(e)}
                    onKeyDown={(e) => addHypen(e)}
                    className={
                      (cellPhoneChck.message === ''
                        ? 'border-gray-300'
                        : 'border-red-300') +
                      ' block w-full text-sm px-3 py-2 rounded-md border shadow-sm outline-indigo-800 focus:border-indigo-500 focus:ring-indigo-500'
                    }
                  />
                  {cellPhoneChck.valid ? null : (
                    <small className="text-sm text-red-500">
                      {cellPhoneChck.message}
                    </small>
                  )}
                </div>
              </div>
              <div></div>
              <div className="md:mt-4">
                <button
                  id="submitbtn"
                  type="submit"
                  className="mr-4 md:w-40 tracking-widest items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {agentId !== undefined ? 'Save all' : 'Submit'}
                </button>

                <button
                  type="button"
                  onClick={handleBack}
                  className="mr-4 md:w-40 tracking-widest items-center rounded-md border border-transparent bg-zinc-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
              </div>

              <div className="md:mt-5 md:text-right my-auto">
                {' '}
                {agentId !== undefined ? (
                  <span
                    type="button"
                    onClick={handleRemove}
                    className="mr-4 md:w-40 mt-2 text-sm text-red-500 text-decoration-line: underline cursor-pointer"
                  >
                    Delete this record
                  </span>
                ) : null}
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default NewRecord;
