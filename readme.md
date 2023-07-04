# How to run the project

** Install docker first and enable kubernetes **

1. cd client && npm i
2. cd k8s && kubectl apply -f .
3. kubectl get pods to get all the running pods info
4. Verify 3 socket instance and 1 redis instance is running
5. cd client && npm run dev
