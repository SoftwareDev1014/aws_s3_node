<template>
  <div class="home">
    <form @submit.prevent="fileUpload">
      <input type="file" @change="readFile" required>
      <button type="submit">upload</button>

    </form>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios"

export default {
  name: 'Home',
  components: {

  },
  data(){
    return {
      file:null
    }
  },
  methods:{
    readFile(e){
      this.file=e.target.files[0]
    },
    async fileUpload() {
      console.log(this.file)
      let formData = new FormData();
      let file = this.file
      formData.append('file', file);
      formData.append('path', 'settings/');
      // formData.append('name', imgname);
      let uploadResult = await axios.post(
        'http://localhost:3001/fileupload', formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      console.log(uploadResult)
    }
  }
}
</script>
