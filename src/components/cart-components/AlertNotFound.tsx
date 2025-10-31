import { useEffect, useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog'
import { useNavigate } from 'react-router-dom';



type Props = {
    tableNumber?: number;
    customers?: number;
}

const AlertNotFound = ({tableNumber, customers}: Props) => {
    const [showAlert, setShowAlert] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {

        if (tableNumber === undefined || customers === undefined){
          setShowAlert(true);
      
        }
      }, [tableNumber, customers ]);
    
      const handleOk = () => {
        setShowAlert(false);
        navigate("/tables");
      }

  return (
    <AlertDialog open={showAlert}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>No has seleccionado una mesa</AlertDialogTitle>
          <AlertDialogDescription>
            Por favor selecciona una mesa antes de continuar.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleOk}>OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AlertNotFound