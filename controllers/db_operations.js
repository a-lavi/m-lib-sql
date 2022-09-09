async function patchTable(pool, table, updates, id) {
    // updates  [{field: 'name', value: 'Changed Name'}, {field: 'address', value: 'New York'}, {field: phone, value: '23423423'}]
    console.log(updates+ 'jhjhj')
    let updateQuery = []
    let updateFields = []
    updates.forEach((element, index) => {
        updateQuery.push(element.value)
        updateFields.push(element.field + "=$" + (index + 1))
    });
    const updatesString = updateFields.toString(', ')
    console.log(updatesString+'eeee')
    sql = `
    UPDATE ${table} 
    SET ${updatesString} 
    WHERE id=${id}`
    console.log('sql', sql)
    return pool.query(sql, updateQuery)
}

module.exports = {patchTable}