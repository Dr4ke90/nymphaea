import React, { useState } from 'react'
import PagePreview from '../../../components/PagePreview/PagePreview'
import Form from '../../../components/Formular/Form'
import Input from '../../../components/Input/Input'
import { Button } from '@mui/material'
import './formServicii.css'

export default function FormServicii({closeModal}) {

    const initialState = {
        cod: '',
        departament: '',
        tip: '',
        pret: ''
    }
    const [newService, setNewService] = useState(initialState)

    const handleChange = (e) => {
        e.preventDefault()
        const {name, value} = e.target
        setNewService({
            ...newService,
            [name]:value
        })
    }

    const handleAdauga = (e) => {
        e.preventDefault()
        console.log(newService)
        closeModal()
    }

    return (
        <PagePreview className="modal-overlay">
          <div className="modal-content">
            <Form className="new-employee-form">
              {Object.keys(initialState).map((key) => {
                const placeholder =
                  key.substring(0, 1).toUpperCase() + key.slice(1);
                  return (
                    <Input
                      key={key}
                      type="text"
                      name={key}
                      placeholder={key === 'cnp' ? "CNP" : placeholder}
                      onChange={handleChange}
                    />
                  );
              })}
              <Input type="submit" onClick={handleAdauga} />
              <Button variant="outlined" onClick={closeModal}>
                Close
              </Button>
            </Form>
          </div>
        </PagePreview>
      );
}
