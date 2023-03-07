import React from 'react'
import * as NextRouterModule from 'next/router'
import ForwardToPotluk from '../pages/404'
import { NextRouter } from 'next/router'

jest.mock('react')
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}))

describe('404 Page', () => {
  let useEffect: (callback: () => unknown) => unknown
  let potlukId: string
  let router: NextRouter

  beforeEach(() => {
    useEffect = (callback: () => unknown): unknown => callback()
    potlukId = 'PotlukID'
    router = {
      replace: async () => await Promise.resolve(true),
      asPath: `/${potlukId}`
    } as any

    jest.spyOn(React, 'useEffect').mockImplementation(useEffect)
    jest.spyOn(NextRouterModule, 'useRouter').mockReturnValue(router)
    jest.spyOn(router, 'replace')

    ForwardToPotluk()
  })

  it('should reroute to [id] page', () => {
    expect(router.replace).toHaveBeenCalledTimes(1)
    expect(router.replace).toHaveBeenCalledWith(potlukId)
  })
})
