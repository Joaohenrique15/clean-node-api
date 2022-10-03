import { DbAddAccount } from './db-add-account'
import { Encrypter } from './protocols/encrypter'

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
}

const makeSut = (): SutTypes => {
  class EncrypterStub {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }

  const encrypterStub = new EncrypterStub()
  const sut = new DbAddAccount(encrypterStub)
  return {
    encrypterStub,
    sut
  }
}

describe('DbAddAccount UseCase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { encrypterStub, sut } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountdata = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }

    await sut.add(accountdata)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
})
