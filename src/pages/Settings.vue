<template>
  <div class="p-6">
    <PageHeader title="Settings" />

    <el-tabs v-model="activeTab" type="border-card">
      <!-- Languages Tab -->
      <el-tab-pane label="Languages" name="languages">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Languages</h3>
        </div>
        <div class="flex justify-end mb-3"> 
        <el-button type="primary" @click="showLanguageForm = true">
          Add Language
        </el-button>
        </div>

        <DataTable
          :data="store.languages"
          :columns="languageColumns"
          :loading="store.loading"
        >
          <template #actions="{ row }">
            <el-button
              type="primary"
              size="small"
              @click="handleEditLanguage(row)"
              class="mr-2"
            >
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDeleteLanguage(row.id)"
            >
              <el-icon><Delete /></el-icon>
            </el-button>
          </template>
        </DataTable>
      </el-tab-pane>

      <!-- Currencies Tab -->
      <el-tab-pane label="Currencies" name="currencies">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Currencies</h3>
        </div>
         <div class="flex justify-end mb-3"> 
        <el-button type="primary" @click="showLanguageForm = true">
          Add currency
        </el-button>
        </div>


        <DataTable
          :data="store.currencies"
          :columns="currencyColumns"
          :loading="store.loading"
        >
          <template #actions="{ row }">
            <el-button
              type="primary"
              size="small"
              @click="handleEditCurrency(row)"
              class="mr-2"
            >
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDeleteCurrency(row.id)"
            >
              <el-icon><Delete /></el-icon>
            </el-button>
          </template>
        </DataTable>
      </el-tab-pane>
    </el-tabs>

    <!-- Add Language Dialog -->
    <FormDialog
      v-model:visible="showLanguageForm"
      v-model:model-value="languageForm"
      title="Add Language"
      width="400px"
      :fields="languageFields"
      :rules="languageRules"
      submit-text="Create"
      :loading="submitting"
      @submit="handleLanguageSubmit"
    />

    <!-- Add Currency Dialog -->
    <FormDialog
      v-model:visible="showCurrencyForm"
      v-model:model-value="currencyForm"
      title="Add Currency"
      width="400px"
      :fields="currencyFields"
      :rules="currencyRules"
      submit-text="Create"
      :loading="submitting"
      @submit="handleCurrencySubmit"
    />

    <!-- Edit Language Dialog -->
    <FormDialog
      v-model:visible="showEditLanguageForm"
      v-model:model-value="languageForm"
      title="Edit Language"
      width="400px"
      :fields="languageFields"
      :rules="languageRules"
      submit-text="Update"
      :loading="submitting"
      @submit="handleLanguageSubmit"
    />

    <!-- Edit Currency Dialog -->
    <FormDialog
      v-model:visible="showEditCurrencyForm"
      v-model:model-value="currencyForm"
      title="Edit Currency"
      width="400px"
      :fields="currencyFields"
      :rules="currencyRules"
      submit-text="Update"
      :loading="submitting"
      @submit="handleCurrencySubmit"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, watch } from "vue";
  import { useSettingsStore } from "@/stores/settings";
  import { Delete, Edit } from '@element-plus/icons-vue';
  import { ElMessageBox } from "element-plus";
  import DataTable from "@/components/DataTable.vue";
  import FormDialog from "@/components/FormDialog.vue";
  import PageHeader from "@/components/PageHeader.vue";

  const store = useSettingsStore();
  const activeTab = ref("languages");
  const showLanguageForm = ref(false);
  const showCurrencyForm = ref(false);
  const showEditLanguageForm = ref(false);
  const showEditCurrencyForm = ref(false);
  const submitting = ref(false);
  const editingLanguage = ref<any>(null);
  const editingCurrency = ref<any>(null);

  // Table columns
  const languageColumns = [
    { prop: "id", label: "ID", width: 80, minWidth: 60 },
    { prop: "code", label: "Code", width: 100, minWidth: 80 },
    { prop: "name", label: "Name", minWidth: 120 },
  ];

  const currencyColumns = [
    { prop: "id", label: "ID", width: 80, minWidth: 60 },
    { prop: "code", label: "Code", width: 100, minWidth: 80 },
    { prop: "symbol", label: "Symbol", width: 100, minWidth: 80 },
    { prop: "name", label: "Name", minWidth: 120 },
  ];

  // Form fields
  const languageFields = [
    {
      prop: "code",
      label: "Code",
      type: "input",
      placeholder: "e.g. en, ar, fr",
      required: true,
    },
    {
      prop: "name",
      label: "Name",
      type: "input",
      placeholder: "e.g. English, Arabic, French",
      required: true,
    },
  ];

  const currencyFields = [
    {
      prop: "code",
      label: "Code",
      type: "input",
      placeholder: "e.g. USD, EUR, SAR",
      required: true,
    },
    {
      prop: "symbol",
      label: "Symbol",
      type: "input",
      placeholder: "e.g. $, €, ﷼",
      required: true,
    },
    {
      prop: "name",
      label: "Name",
      type: "input",
      placeholder: "e.g. US Dollar, Euro, Saudi Riyal",
      required: true,
    },
  ];

  // Form data
  const languageForm = reactive({
    code: "",
    name: "",
  });

  const currencyForm = reactive({
    code: "",
    symbol: "",
    name: "",
  });

  // Validation rules
  const languageRules = {
    code: [
      {
        required: true,
        message: "Please input language code",
        trigger: "blur",
      },
    ],
    name: [
      {
        required: true,
        message: "Please input language name",
        trigger: "blur",
      },
    ],
  };

  const currencyRules = {
    code: [
      {
        required: true,
        message: "Please input currency code",
        trigger: "blur",
      },
    ],
    symbol: [
      {
        required: true,
        message: "Please input currency symbol",
        trigger: "blur",
      },
    ],
    name: [
      {
        required: true,
        message: "Please input currency name",
        trigger: "blur",
      },
    ],
  };

  onMounted(() => {
    store.fetchLanguages();
    store.fetchCurrencies();
  });

  watch(activeTab, (newTab) => {
    if (newTab === "languages") {
      store.fetchLanguages();
    } else if (newTab === "currencies") {
      store.fetchCurrencies();
    }
  });

  async function handleLanguageSubmit() {
    try {
      submitting.value = true;

      if (editingLanguage.value) {
        // Update existing language
        await store.updateLanguage(editingLanguage.value.id, {
          code: languageForm.code,
          name: languageForm.name,
        });
        showEditLanguageForm.value = false;
      } else {
        // Create new language
        await store.createLanguage({
          code: languageForm.code,
          name: languageForm.name,
        });
        showLanguageForm.value = false;
      }

      resetLanguageForm();
    } catch (error) {
      console.error("Failed to submit language:", error);
    } finally {
      submitting.value = false;
    }
  }

  function handleEditLanguage(language: any) {
    editingLanguage.value = language;
    Object.assign(languageForm, {
      code: language.code,
      name: language.name,
    });
    showEditLanguageForm.value = true;
  }

  async function handleCurrencySubmit() {
    try {
      submitting.value = true;

      if (editingCurrency.value) {
        // Update existing currency
        await store.updateCurrency(editingCurrency.value.id, {
          code: currencyForm.code,
          symbol: currencyForm.symbol,
          name: currencyForm.name,
        });
        showEditCurrencyForm.value = false;
      } else {
        // Create new currency
        await store.createCurrency({
          code: currencyForm.code,
          symbol: currencyForm.symbol,
          name: currencyForm.name,
        });
        showCurrencyForm.value = false;
      }

      resetCurrencyForm();
    } catch (error) {
      console.error("Failed to submit currency:", error);
    } finally {
      submitting.value = false;
    }
  }

  function handleEditCurrency(currency: any) {
    editingCurrency.value = currency;
    Object.assign(currencyForm, {
      code: currency.code,
      symbol: currency.symbol,
      name: currency.name,
    });
    showEditCurrencyForm.value = true;
  }

  function resetLanguageForm() {
    editingLanguage.value = null;
    Object.assign(languageForm, {
      code: "",
      name: "",
    });
  }

  function resetCurrencyForm() {
    editingCurrency.value = null;
    Object.assign(currencyForm, {
      code: "",
      symbol: "",
      name: "",
    });
  }

  async function handleDeleteLanguage(id: number) {
    try {
      await ElMessageBox.confirm(
        "This will permanently delete the language. Continue?",
        "Warning",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      );
      await store.deleteLanguage(id);
    } catch {
      // User cancelled
    }
  }

  async function handleDeleteCurrency(id: number) {
    try {
      await ElMessageBox.confirm(
        "This will permanently delete the currency. Continue?",
        "Warning",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      );
      await store.deleteCurrency(id);
    } catch {
      // User cancelled
    }
  }
</script>
