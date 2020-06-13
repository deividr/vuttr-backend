const obj = {
  name: 'Deivid',
  lastname: 'Rodrigues',
  email: 'deivid@gmail.com',
  contador: 30,
  quantity: 30,
}

function printer(): boolean {
  const a = 30
  console.log('Goes printer message for user...', a)
  return true
}

const functionOk = (msg: string): void => {
  console.log('Be function...', msg)
}

functionOk('Olá, Deivid.')

if (printer()) {
  console.log(obj)
}
