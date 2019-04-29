<template>
  <div ref="drop-area" class="uploader"
    @drop.prevent="initialDrop"
    @dragover.prevent
    @click="uploadFile">
    {{ promptMessage }}
  </div>
</template>

<script>
export default {
  props: {
    promptMessage: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      cover: null,
      coverInfo: {
        name: '',
        size: '',
        type: '',
      }
    }
  },
  methods: {
    _passCoverToParent() {
      this.$emit('imageAdded', {
        cover: this.cover,
        info: this.coverInfo
      });
    },
    uploadFile() {
      // If Have Previous Cover, delete it.
      if (this.cover) { 
        this.cover = null;
      }

      // Input 設定
      let newInput = document.createElement('input');
      newInput.type = 'file';
      newInput.accept = 'image/*';
      newInput.size = 1;

      // Add Event
      newInput.addEventListener('change', () => {
        let reader = new FileReader();
        let file = newInput.files[0];

        // 確認是否合法檔案格式
        if (['image/jpeg', 'image/png'].indexOf(file.type) === -1) {
          this.$message('檔案只接受圖片格式');
          newInput.remove();
          return;
        }

        // Add to cover
        this.cover = file;

        // Update File Info.
        let { name, size, type } = file;
        Object.assign(this.coverInfo, {name, size, type});

        reader.readAsDataURL(file);

        reader.addEventListener('load', () => {
          let fileUrl = reader.result;

          // Render Image
          this.$refs['drop-area'].innerHTML = "";   // Clear Previous Text.
          let image = new Image();                  // Create New Image.
          image.src = fileUrl;                      // Load Image
          image.style.width = '100%';
          image.style.height = 'auto';
          image.onload = () => {
            // Add Element to Father
            this.$refs['drop-area'].appendChild(image);

            // Remove Input
            newInput.remove();

            this._passCoverToParent();
          }
        })
      })
      newInput.click();
    },
    async initialDrop(dragEvent) {
      // If Have Previous Cover, delete it.
      if (this.cover) { 
        this.cover = null;
      }

      // Get Data Transfer Object
      let { dataTransfer } = dragEvent;
      let { items } = dataTransfer;

      // Referenct
      let vm = this;

      // Read File
      function readFile() {
        return new Promise((res, rej) => {
          let reader = new FileReader();
          let file = items[0].getAsFile();

          if (!file) rej('Drag Item Is Not A File');

          // 確認是否合法檔案格式
          if (['image/jpeg', 'image/png'].indexOf(file.type) === -1) {
            rej('Only Accept Image Type Of File');
          }

          // Update to cover
          vm.cover = file;

          // Update File Info.
          let { name, size, type } = file;
          Object.assign(vm.coverInfo, {name, size, type});

          reader.onload = () => {
            res(reader.result);
          }
          reader.readAsDataURL(file);
        })
      }

      // Get URL
      try {
        let fileUrl = await readFile();
      } catch (err) {
        this.$message('檔案只接受圖片格式')
      }

      // Render Image
      this.$refs['drop-area'].innerHTML = "";   // Clear Previous Text.
      let image = new Image();                  // Create New Image.
      image.src = fileUrl;                      // Load Image
      image.style.width = '100%';
      image.style.height = 'auto';
      image.onload = () => {
        // Add Element to Father
        this.$refs['drop-area'].appendChild(image);
        this._passCoverToParent();
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$main-color: #7c7780;

.uploader {
  width: 100%;
  height: 100%;
  border: solid $main-color 2px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
