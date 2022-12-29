import { useRouter } from 'next/router'
import { useEffect } from 'react';

const NotFound = () => {
	const router = useRouter()

  useEffect(() => {
    console.log(404);
    router.push(router.asPath)
  }, [])
}

export default NotFound