import axios from 'axios';

const API_KEY = "wxwqlfdkpzd3the90"
const BASE_URL = "https://techhk.aoscdn.com/"

const MAXIMUM_RETIRES =20;

export const enhancedImageAPI = async(file) => {
    
    try{
        const taskId = await uploadImage(file)
        console.log("Image Uploaded Succesfully, Task ID:", taskId)



        const enhancedImageData = await PollforEnhancedImage(taskId)
        console.log("Enhanced Image Data:", enhancedImageData)
        
        return enhancedImageData
        
    }catch (error) {
        console.log("Error enhancing image:", error.message)
    }
}

const uploadImage = async(file) => {
    const formData = new FormData()
    formData.append("image_file",file)

        const {data} = await axios.post(`${BASE_URL}/api/tasks/visual/scale`, formData,{
            headers:{
            "Content-Type":"multipart/form-data",
            "X-API-KEY":API_KEY,
            },
        });

        if(!data?.data?.task_id){
            throw new Error("Failed to upload image! Task ID not found.");
        }
        // "/api/tasks/visual/scale" --post
        
        return data.data.task_id;
}

const fetchEnhancedImage = async(taskId) => {
//fetched enhance image
 const {data} = await axios.get(`${BASE_URL}/api/tasks/visual/scale/${taskId}`, {
            headers:{

            "X-API-KEY":API_KEY,
            },
        });
        if(!data?.data){
            throw new Error("Failed to fetch enhanced image! Image not found")
        }
        return data.data;
        // "/api/tasks/visual/scale/{task_id}"  --get
}

const PollforEnhancedImage = async (taskId, retries = 0) => {
    const result = await fetchEnhancedImage(taskId);

    if(result.state === 4) {
        console.log(`Processing...(${retries}/ ${MAXIMUM_RETIRES})`)

        if(retries >= MAXIMUM_RETIRES){
            throw new Error("Max retries reached. Please try again later.")
        }

        // wait for 2 second 
        await new Promise((resolve) => setTimeout(resolve, 2000));

        return PollforEnhancedImage(taskId, retries + 1)
    }
    console.log("Enhanced Image URL:", result);
    return result
}


// {status: 200, message: 'success', data: {…}}
// data
// : 
// {task_id: '901570d7-a815-4293-a7fe-927ed54d4338'}
// message
// : 
// "success"
// status
// : 
// 200