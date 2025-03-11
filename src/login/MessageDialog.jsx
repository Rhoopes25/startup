import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export function MessageDialog({ message, onHide }) {
  return (
    <Modal show={!!message} onHide={onHide} centered>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}