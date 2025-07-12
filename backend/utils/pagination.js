// Simple pagination utility for MongoDB
export const paginate = async (model, query = {}, options = {}) => {
  const {
    page = 1,
    limit = 10,
    sort = { createdAt: -1 },
    populate = null,
    select = null
  } = options;

  const skip = (page - 1) * limit;
  
  // Build query
  let queryBuilder = model.find(query);
  
  // Apply select
  if (select) {
    queryBuilder = queryBuilder.select(select);
  }
  
  // Apply populate
  if (populate) {
    if (Array.isArray(populate)) {
      populate.forEach(pop => {
        queryBuilder = queryBuilder.populate(pop);
      });
    } else {
      queryBuilder = queryBuilder.populate(populate);
    }
  }
  
  // Apply sort
  queryBuilder = queryBuilder.sort(sort);
  
  // Get total count
  const totalDocs = await model.countDocuments(query);
  
  // Get paginated results
  const docs = await queryBuilder.skip(skip).limit(limit);
  
  // Calculate pagination info
  const totalPages = Math.ceil(totalDocs / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  
  return {
    docs,
    totalDocs,
    limit,
    page,
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? page + 1 : null,
    prevPage: hasPrevPage ? page - 1 : null
  };
};

// Add paginate method to mongoose models
export const addPaginationToModel = (model) => {
  model.paginate = function(query = {}, options = {}) {
    return paginate(this, query, options);
  };
}; 