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
          :show-actions="true"
          :actions-width="120"
        >
          <template #actions="{ row }">
            <el-button
              type="danger"
              size="small"
              @click="handleDeleteLanguage(row.id)"
            >
              Delete
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
          :show-actions="true"
          :actions-width="120"
        >
          <template #actions="{ row }">
            <el-button
              type="danger"
              size="small"
              @click="handleDeleteCurrency(row.id)"
            >
              Delete
            </el-button>
          </template>
        </DataTable>
      </el-tab-pane>
    </el-tabs>

    <!-- Add Language Dialog -->
    <FormDialog
      v-model:visible="showLanguageForm"
      v-model="languageForm"
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
      v-model="currencyForm"
      title="Add Currency"
      width="400px"
      :fields="currencyFields"
      :rules="currencyRules"
      submit-text="Create"
      :loading="submitting"
      @submit="handleCurrencySubmit"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, watch } from "vue";
  import { useSettingsStore } from "@/stores/settings";
  import { ElMessageBox } from "element-plus";
  import DataTable from "@/components/DataTable.vue";
  import FormDialog from "@/components/FormDialog.vue";
  import PageHeader from "@/components/PageHeader.vue";

  const store = useSettingsStore();
  const activeTab = ref("languages");
  const showLanguageForm = ref(false);
  const showCurrencyForm = ref(false);
  const submitting = ref(false);

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
      type: "input" as const,
      placeholder: "e.g. en, ar, fr",
      required: true,
    },
    {
      prop: "name",
      label: "Name",
      type: "input" as const,
      placeholder: "e.g. English, Arabic, French",
      required: true,
    },
  ];

  const currencyFields = [
    {
      prop: "code",
      label: "Code",
      type: "input" as const,
      placeholder: "e.g. USD, EUR, SAR",
      required: true,
    },
    {
      prop: "symbol",
      label: "Symbol",
      type: "input" as const,
      placeholder: "e.g. $, €, ﷼",
      required: true,
    },
    {
      prop: "name",
      label: "Name",
      type: "input" as const,
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

      await store.createLanguage({
        code: languageForm.code,
        name: languageForm.name,
      });

      showLanguageForm.value = false;
      resetLanguageForm();
    } catch (error) {
      console.error("Failed to create language:", error);
    } finally {
      submitting.value = false;
    }
  }

  async function handleCurrencySubmit() {
    try {
      submitting.value = true;

      await store.createCurrency({
        code: currencyForm.code,
        symbol: currencyForm.symbol,
        name: currencyForm.name,
      });

      showCurrencyForm.value = false;
      resetCurrencyForm();
    } catch (error) {
      console.error("Failed to create currency:", error);
    } finally {
      submitting.value = false;
    }
  }

  function resetLanguageForm() {
    Object.assign(languageForm, {
      code: "",
      name: "",
    });
  }

  function resetCurrencyForm() {
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
