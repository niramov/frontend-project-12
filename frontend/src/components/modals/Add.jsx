import React, {useRef, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useFormik} from 'formik';
import {Modal, Form, Button} from 'react-bootstrap';
import * as Yup from 'yup';
import {useTranslation} from 'react-i18next';
import {toast} from 'react-toastify';
import useChatApi from '../../hooks/useChatApi';
import {getChannels} from '../../store/selectors';

const Add = ({hideModal}) => {
  const {t} = useTranslation();
  const inputRef = useRef();
  const api = useChatApi();
  const channels = useSelector(getChannels);
  const channelsList = Object.values(channels);
  const channelsNames = channelsList.map(({name}) => name);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const sendChannelName = (values) => {
    const channelName = {name: values.name};
    api.addNewChannel(channelName);
    hideModal();
    toast.success(t('toast.add'));
  };

  const AddChannelSchema = Yup.object().shape({
    name: Yup.string()
      .min(1, t('modals.minName'))
      .max(20, t('modals.maxName'))
      .notOneOf(channelsNames, t('modals.uniq')),
  });

  const formik = useFormik({
    initialValues: {name: ''},
    onSubmit: (values) => sendChannelName(values),
    validationSchema: AddChannelSchema,
  });

  const {handleChange, values, handleSubmit, errors} = formik;

  return (
    <Modal show>
      <Modal.Header closeButton onHide={hideModal}>
        <Modal.Title>{t('modals.addTitle')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Control
              required
              ref={inputRef}
              onChange={handleChange}
              value={values.name}
              isInvalid={!!errors.name}
              name="name"
            />
            <Form.Label className="visually-hidden" htmlFor="name">
              {t('modals.modalName')}
            </Form.Label>
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            <div className="d-flex justify-content-end">
              <Button
                type="button"
                onClick={hideModal}
                variant="secondary"
                className="btn btn-primary me-2 mt-2"
              >
                {t('modals.cancellButton')}
              </Button>
              <Button type="submit" variant="primary" className="btn btn-primary mt-2">
                {t('modals.confirmButton')}
              </Button>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Add;
